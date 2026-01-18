import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Activity, BarChart3, Timer, ArrowLeft } from 'lucide-react'

// Servicios y Tipos
import { runService } from '../services/runService'
import { shoeService } from '../services/shoeService'
import { workoutService } from '../services/workoutService'
import { getErrorMessage } from '../services/errorHandler'
import type { RunDetailsCreateRequest, RunIntervalType } from '../types/run'
import type { ShoeSummaryResponse } from '../types/shoe'
import type { IntervalFormData } from '../components/run/RunIntervalForm'

// Componentes
import RunIntervalForm from '../components/run/RunIntervalForm'
import RunHeader from '../components/run/RunHeader'
import WeekCalendar from '../components/ui/WeekCalendar'
import DistanceInput from '../components/ui/DistanceInput'
import IntensityCard from '../components/run/IntensityCard'
import ShoeSelector from '../components/run/ShoeSelector'
import NotesCollapsible from '../components/run/NotesCollapsible'
import SaveButton from '../components/run/SaveButton'

type RunMode = 'simple' | 'intervals'

const emptyInterval: IntervalFormData = {
    type: 'WORK',
    durationSeconds: 0,
    distanceMeters: null,
    averageHr: null,
    cadenceSpm: null,
    elevationGain: null,
    notes: '',
}

export default function NewRunPage({ userId }: { userId: number | null }) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const workoutIdParam = searchParams.get('workoutId')

    // REF para el scroll (NUEVO)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isCompact, setIsCompact] = useState(false)

    // --- ESTADOS LÓGICOS (ROBUSTEZ MANTENIDA) ---
    const [mode, setMode] = useState<RunMode>('simple')
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Datos generales
    const [workoutDate, setWorkoutDate] = useState<Date>(new Date())
    const [shoeId, setShoeId] = useState<number | null>(null)
    const [notes, setNotes] = useState('')
    const [shoes, setShoes] = useState<ShoeSummaryResponse[]>([])

    // Datos Modo Simple
    const [simpleDuration, setSimpleDuration] = useState(0)
    const [simpleDistance, setSimpleDistance] = useState(0)
    const [simpleHr, setSimpleHr] = useState<number | null>(null)
    const [simpleElevation, setSimpleElevation] = useState<number | null>(null)
    const [feeling, setFeeling] = useState<number | null>(null)

    // Datos Modo Intervalos
    const [intervals, setIntervals] = useState<IntervalFormData[]>([{ ...emptyInterval }])
    const [workoutId, setWorkoutId] = useState<number | null>(workoutIdParam ? parseInt(workoutIdParam) : null)

    // --- EFECTO DE SCROLL (NUEVO) ---
    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                // Si scrolleamos más de 20px, compactamos el header
                setIsCompact(scrollRef.current.scrollTop > 20)
            }
        }
        const ref = scrollRef.current
        ref?.addEventListener('scroll', handleScroll)
        return () => ref?.removeEventListener('scroll', handleScroll)
    }, [])

    // --- CARGA DE DATOS ---
    useEffect(() => {
        if (userId) loadInitialData()
    }, [userId, workoutIdParam])

    const loadInitialData = async () => {
        if (!userId) return
        try {
            setLoadingData(true)
            const shoesData = await shoeService.getActiveSummary(userId)
            setShoes(shoesData)

            if (workoutIdParam) {
                const wId = parseInt(workoutIdParam)
                setWorkoutId(wId)

                try {
                    const workoutData = await workoutService.getById(userId, wId)
                    setWorkoutDate(new Date(workoutData.startDateTime))
                } catch { }

                try {
                    const details = await runService.getDetails(userId, wId)
                    setShoeId(details.shoe?.id ?? null)
                    setNotes(details.notes ?? '')

                    if (details.intervals.length > 1) {
                        setMode('intervals')
                        setIntervals(details.intervals.map(i => ({ ...i, notes: i.notes ?? '' })))
                    } else if (details.intervals.length === 1) {
                        setMode('simple')
                        const i = details.intervals[0]
                        setSimpleDuration(i.durationSeconds)
                        setSimpleDistance(i.distanceMeters ?? 0)
                        setSimpleHr(i.averageHr)
                        setSimpleElevation(i.elevationGain)
                    }
                } catch { }
            }
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoadingData(false)
        }
    }

    // --- MANEJADORES ---
    const handleAddInterval = () => setIntervals([...intervals, { ...emptyInterval }])
    const handleRemoveInterval = (index: number) => setIntervals(intervals.filter((_, i) => i !== index))
    const handleUpdateInterval = (index: number, val: IntervalFormData) => {
        const copy = [...intervals]
        copy[index] = val
        setIntervals(copy)
    }

    const handleSubmit = async () => {
        if (!userId) return
        setLoading(true)
        setError(null)

        try {
            let requestIntervals: RunDetailsCreateRequest['intervals'] = []

            if (mode === 'simple') {
                if (simpleDuration === 0) throw new Error('La duración es obligatoria')

                requestIntervals = [{
                    type: 'WORK',
                    durationSeconds: simpleDuration,
                    distanceMeters: simpleDistance > 0 ? simpleDistance : null,
                    averageHr: simpleHr,
                    cadenceSpm: null,
                    elevationGain: simpleElevation,
                    notes: null,
                }]
            } else {
                const valid = intervals.filter(i => i.durationSeconds > 0)
                if (valid.length === 0) throw new Error('Añade al menos un intervalo con duración')

                requestIntervals = valid.map(i => ({
                    type: i.type as RunIntervalType,
                    durationSeconds: i.durationSeconds,
                    distanceMeters: i.distanceMeters,
                    averageHr: i.averageHr,
                    cadenceSpm: i.cadenceSpm,
                    elevationGain: i.elevationGain,
                    notes: i.notes.trim() || null,
                }))
            }

            let wId = workoutId
            const isoDate = workoutDate.toISOString()

            if (!wId) {
                const workout = await workoutService.create(userId, { type: 'RUN', startDateTime: isoDate })
                wId = workout.id
                setWorkoutId(wId)
            } else {
                await workoutService.update(userId, wId, { startDateTime: isoDate })
            }

            let totalDistance = 0
            let totalElevation = 0

            if (mode === 'simple') {
                totalDistance = simpleDistance
                totalElevation = simpleElevation ?? 0
            } else {
                totalDistance = requestIntervals.reduce((acc, i) => acc + (i.distanceMeters ?? 0), 0)
                totalElevation = requestIntervals.reduce((acc, i) => acc + (i.elevationGain ?? 0), 0)
            }

            let finalNotes = notes.trim()
            if (feeling && mode === 'simple') {
                const feelingMap: Record<number, string> = { 1: 'Muy duro', 2: 'Duro', 3: 'Normal', 4: 'Bien', 5: 'Genial' }
                finalNotes = finalNotes ? `${finalNotes}\n\nSensación: ${feelingMap[feeling]}` : `Sensación: ${feelingMap[feeling]}`
            }

            const request: RunDetailsCreateRequest = {
                totalDistanceMeters: totalDistance > 0 ? totalDistance : null,
                totalElevationGain: totalElevation > 0 ? totalElevation : null,
                averageHr: mode === 'simple' ? simpleHr : null,
                shoeId,
                notes: finalNotes || null,
                intervals: requestIntervals,
            }

            await runService.saveDetails(userId, wId, request)
            navigate('/workouts')

        } catch (err) {
            setError(getErrorMessage(err) || 'Error al guardar')
        } finally {
            setLoading(false)
        }
    }

    if (!userId || loadingData) return <div className="p-8 text-center text-gray-500">Cargando...</div>

    return (
        // LAYOUT PRINCIPAL: Fixed Height + Flex Column
        <div className="h-[100dvh] flex flex-col bg-gray-50 overflow-hidden">

            {/* 1. HEADER (Fuera del scroll area, o sticky dentro de él) */}
            <div className="relative z-20 flex-shrink-0 transition-all duration-300">
                {/* Botón Volver Flotante */}
                <button
                    onClick={() => navigate('/workouts')}
                    className={`absolute top-4 left-4 z-30 p-2 rounded-full transition-colors ${isCompact ? 'text-white hover:bg-white/10' : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <RunHeader
                    title={mode === 'simple' ? 'Rodaje' : 'Series'}
                    subtitle={workoutDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    compact={isCompact} // Pasamos el estado al componente
                />
            </div>

            {/* 2. ÁREA SCROLLEABLE (Con Ref) */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto scrollbar-hide"
            >
                {/* Calendario */}
                <WeekCalendar
                    selectedDate={workoutDate}
                    onSelectDate={setWorkoutDate}
                />

                {/* Error Alert */}
                {error && (
                    <div className="mx-4 mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {/* Tabs Selector de Modo */}
                <div className="px-4 py-4">
                    <div className="bg-gray-200 p-1 rounded-xl flex">
                        <button
                            onClick={() => setMode('simple')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${mode === 'simple' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Timer className="w-4 h-4" />
                            Simple
                        </button>
                        <button
                            onClick={() => setMode('intervals')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${mode === 'intervals' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            Intervalos
                        </button>
                    </div>
                </div>

                {/* FORMULARIO */}
                {mode === 'simple' ? (
                    <div className="space-y-2 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <DistanceInput
                            value={simpleDistance}
                            onChange={setSimpleDistance}
                        />
                        <IntensityCard
                            heartRate={simpleHr}
                            onHeartRateChange={setSimpleHr}
                            feeling={feeling}
                            onFeelingChange={setFeeling}
                        />
                    </div>
                ) : (
                    <div className="px-4 pb-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bloques</span>
                            <button onClick={handleAddInterval} className="text-sm font-bold text-green-600">
                                + Añadir Intervalo
                            </button>
                        </div>
                        {intervals.map((interval, idx) => (
                            <RunIntervalForm
                                key={idx}
                                index={idx}
                                interval={interval}
                                onChange={handleUpdateInterval}
                                onRemove={handleRemoveInterval}
                                canRemove={intervals.length > 1}
                            />
                        ))}
                    </div>
                )}

                {/* Componentes Comunes (Zapatillas y Notas) */}
                <div className="pb-8 space-y-1"> {/* Padding bottom extra para aire antes del footer */}
                    <ShoeSelector
                        shoes={shoes}
                        selectedShoeId={shoeId}
                        onSelectShoe={setShoeId}
                        onAddShoe={() => navigate('/gear/shoes/new')}
                    />
                    <NotesCollapsible
                        value={notes}
                        onChange={setNotes}
                    />
                </div>
            </div>

            {/* 3. FOOTER FIJO (Fuera del scroll) */}
            <div className="flex-shrink-0 bg-white border-t border-gray-100 p-4 pb-safe z-20">
                <SaveButton
                    onClick={handleSubmit}
                    loading={loading}
                // Quitamos el div wrapper del componente SaveButton original si es necesario, 
                // o dejamos que este div actúe como contenedor.
                />
            </div>

        </div>
    )
}