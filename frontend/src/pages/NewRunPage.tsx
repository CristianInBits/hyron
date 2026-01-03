import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Dog, Plus, ArrowLeft, Save, Timer, BarChart3 } from 'lucide-react'
import { runService } from '../services/runService'
import { shoeService } from '../services/shoeService'
import { workoutService } from '../services/workoutService'
import type { RunDetailsCreateRequest, RunIntervalType } from '../types/run'
import type { ShoeSummaryResponse } from '../types/shoe'
import RunIntervalForm from '../components/run/RunIntervalForm'
import type { IntervalFormData } from '../components/run/RunIntervalForm'
import { getErrorMessage } from '../services/errorHandler'

type NewRunPageProps = {
    userId: number | null
}

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

function NewRunPage({ userId }: NewRunPageProps) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const workoutIdParam = searchParams.get('workoutId')

    // Modo del formulario
    const [mode, setMode] = useState<RunMode | null>(null)

    // Estado para modo simple
    const [simpleDuration, setSimpleDuration] = useState('')
    const [simpleDistance, setSimpleDistance] = useState('')
    const [simpleHr, setSimpleHr] = useState('')
    const [simpleElevation, setSimpleElevation] = useState('')

    // Estado para modo intervalos
    const [intervals, setIntervals] = useState<IntervalFormData[]>([{ ...emptyInterval }])

    // Estado compartido
    const [shoeId, setShoeId] = useState<number | null>(null)
    const [notes, setNotes] = useState('')
    const [workoutId, setWorkoutId] = useState<number | null>(workoutIdParam ? parseInt(workoutIdParam) : null)

    // Estado de UI
    const [shoes, setShoes] = useState<ShoeSummaryResponse[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (userId) {
            loadInitialData()
        }
    }, [userId, workoutIdParam])

    const loadInitialData = async () => {
        if (!userId) return

        try {
            setLoadingData(true)

            // Cargar zapatillas activas
            const shoesData = await shoeService.getActive(userId)
            setShoes(shoesData)

            // Si hay workoutId, cargar los detalles existentes
            if (workoutIdParam) {
                const wId = parseInt(workoutIdParam)
                setWorkoutId(wId)

                try {
                    const details = await runService.getDetails(userId, wId)
                    setShoeId(details.shoe?.id ?? null)
                    setNotes(details.notes ?? '')

                    // Determinar el modo según los intervalos
                    if (details.intervals.length === 1) {
                        // Modo simple
                        setMode('simple')
                        const interval = details.intervals[0]
                        setSimpleDuration(formatDurationForInput(interval.durationSeconds))
                        setSimpleDistance(interval.distanceMeters?.toString() ?? '')
                        setSimpleHr(interval.averageHr?.toString() ?? '')
                        setSimpleElevation(interval.elevationGain?.toString() ?? '')
                    } else if (details.intervals.length > 1) {
                        // Modo intervalos
                        setMode('intervals')
                        setIntervals(details.intervals.map(i => ({
                            type: i.type,
                            durationSeconds: i.durationSeconds,
                            distanceMeters: i.distanceMeters,
                            averageHr: i.averageHr,
                            cadenceSpm: i.cadenceSpm,
                            elevationGain: i.elevationGain,
                            notes: i.notes ?? '',
                        })))
                    }
                } catch {
                    // No hay detalles aún
                }
            }
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoadingData(false)
        }
    }

    const formatDurationForInput = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const parseDuration = (value: string): number => {
        const parts = value.split(':')
        if (parts.length === 2) {
            const mins = parseInt(parts[0]) || 0
            const secs = parseInt(parts[1]) || 0
            return mins * 60 + secs
        }
        return parseInt(value) * 60 || 0
    }

    const handleAddInterval = () => {
        setIntervals([...intervals, { ...emptyInterval }])
    }

    const handleUpdateInterval = (index: number, interval: IntervalFormData) => {
        const updated = [...intervals]
        updated[index] = interval
        setIntervals(updated)
    }

    const handleRemoveInterval = (index: number) => {
        setIntervals(intervals.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (!userId || !mode) return

        try {
            setLoading(true)
            setError(null)

            let requestIntervals: RunDetailsCreateRequest['intervals'] = []

            if (mode === 'simple') {
                const duration = parseDuration(simpleDuration)
                if (duration === 0) {
                    setError('La duración es obligatoria')
                    setLoading(false)
                    return
                }

                requestIntervals = [{
                    type: 'WORK' as RunIntervalType,
                    durationSeconds: duration,
                    distanceMeters: simpleDistance ? parseInt(simpleDistance) : null,
                    averageHr: simpleHr ? parseInt(simpleHr) : null,
                    elevationGain: simpleElevation ? parseInt(simpleElevation) : null,
                    notes: null,
                }]
            } else {
                const validIntervals = intervals.filter(i => i.durationSeconds > 0)
                if (validIntervals.length === 0) {
                    setError('Añade al menos un intervalo con duración')
                    setLoading(false)
                    return
                }

                requestIntervals = validIntervals.map(i => ({
                    type: i.type as RunIntervalType,
                    durationSeconds: i.durationSeconds,
                    distanceMeters: i.distanceMeters,
                    averageHr: i.averageHr,
                    cadenceSpm: i.cadenceSpm,
                    elevationGain: i.elevationGain,
                    notes: i.notes.trim() || null,
                }))
            }

            // Si no hay workoutId, crear el workout primero
            let wId = workoutId
            if (!wId) {
                const workout = await workoutService.create(userId, {
                    type: 'RUN',
                    startDateTime: new Date().toISOString(),
                })
                wId = workout.id
                setWorkoutId(wId)
            }

            // Calcular totales para modo intervalos
            let totalDistance: number | null = null
            let totalElevation: number | null = null
            let avgHr: number | null = null

            if (mode === 'simple') {
                totalDistance = simpleDistance ? parseInt(simpleDistance) : null
                totalElevation = simpleElevation ? parseInt(simpleElevation) : null
                avgHr = simpleHr ? parseInt(simpleHr) : null
            } else {
                // Sumar distancias y desniveles de intervalos
                const distances = requestIntervals.map(i => i.distanceMeters ?? 0)
                const elevations = requestIntervals.map(i => i.elevationGain ?? 0)
                totalDistance = distances.reduce((a, b) => a + b, 0) || null
                totalElevation = elevations.reduce((a, b) => a + b, 0) || null
            }

            const request: RunDetailsCreateRequest = {
                totalDistanceMeters: totalDistance,
                totalElevationGain: totalElevation,
                averageHr: avgHr,
                shoeId: shoeId,
                notes: notes.trim() || null,
                intervals: requestIntervals,
            }

            await runService.saveDetails(userId, wId, request)
            navigate('/workouts')
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    // Pantalla de selección de usuario
    if (!userId) {
        return (
            <div className="bg-green-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <Dog className="w-10 h-10 mr-3 text-green-600" />
                    <h1 className="text-2xl font-bold text-green-700">Nuevo Run</h1>
                </div>
                <p className="text-green-600">Selecciona un usuario primero</p>
            </div>
        )
    }

    // Pantalla de carga
    if (loadingData) {
        return (
            <div className="bg-green-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <Dog className="w-10 h-10 mr-3 text-green-600" />
                    <h1 className="text-2xl font-bold text-green-700">Nuevo Run</h1>
                </div>
                <p className="text-green-600">Cargando...</p>
            </div>
        )
    }

    // Pantalla de selección de modo
    if (!mode) {
        return (
            <div className="bg-green-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/workouts')}
                        className="p-2 mr-2 text-green-600 hover:bg-green-100 rounded-lg"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <Dog className="w-10 h-10 mr-3 text-green-600" />
                    <h1 className="text-2xl font-bold text-green-700">Nuevo Run</h1>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        ¿Qué tipo de carrera?
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setMode('simple')}
                            className="flex flex-col items-center p-6 bg-green-50 rounded-xl border-2 border-green-200 hover:border-green-400 transition-colors"
                        >
                            <Timer className="w-12 h-12 text-green-500 mb-3" />
                            <span className="font-semibold text-green-700">Simple</span>
                            <span className="text-sm text-green-600 mt-1 text-center">Rodaje, carrera continua</span>
                        </button>

                        <button
                            onClick={() => setMode('intervals')}
                            className="flex flex-col items-center p-6 bg-green-50 rounded-xl border-2 border-green-200 hover:border-green-400 transition-colors"
                        >
                            <BarChart3 className="w-12 h-12 text-green-500 mb-3" />
                            <span className="font-semibold text-green-700">Series</span>
                            <span className="text-sm text-green-600 mt-1 text-center">Intervalos, fartlek</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Formulario modo SIMPLE
    if (mode === 'simple') {
        return (
            <div className="bg-green-50 min-h-screen -m-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => setMode(null)}
                            className="p-2 mr-2 text-green-600 hover:bg-green-100 rounded-lg"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <Dog className="w-10 h-10 mr-3 text-green-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-green-700">Rodaje</h1>
                            <p className="text-sm text-green-600">Carrera simple</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5 mr-1" />
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Formulario simple */}
                <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
                    {/* Duración y Distancia */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duración (mm:ss) *
                            </label>
                            <input
                                type="text"
                                value={simpleDuration}
                                onChange={(e) => setSimpleDuration(e.target.value)}
                                placeholder="30:00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Distancia (m)
                            </label>
                            <input
                                type="number"
                                value={simpleDistance}
                                onChange={(e) => setSimpleDistance(e.target.value)}
                                placeholder="6000"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>

                    {/* FC y Desnivel */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                FC Media
                            </label>
                            <input
                                type="number"
                                value={simpleHr}
                                onChange={(e) => setSimpleHr(e.target.value)}
                                placeholder="145"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Desnivel (m)
                            </label>
                            <input
                                type="number"
                                value={simpleElevation}
                                onChange={(e) => setSimpleElevation(e.target.value)}
                                placeholder="50"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>

                    {/* Zapatillas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Zapatillas
                        </label>
                        <select
                            value={shoeId ?? ''}
                            onChange={(e) => setShoeId(e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="">Sin zapatillas</option>
                            {shoes.map(shoe => (
                                <option key={shoe.id} value={shoe.id}>
                                    {shoe.nickname || `${shoe.brand} ${shoe.model}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notas
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Rodaje suave por el parque..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                        />
                    </div>
                </div>
            </div>
        )
    }

    // Formulario modo INTERVALOS
    return (
        <div className="bg-green-50 min-h-screen -m-4 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button
                        onClick={() => setMode(null)}
                        className="p-2 mr-2 text-green-600 hover:bg-green-100 rounded-lg"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <Dog className="w-10 h-10 mr-3 text-green-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-green-700">Series</h1>
                        <p className="text-sm text-green-600">Intervalos</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                    <Save className="w-5 h-5 mr-1" />
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Datos generales */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Zapatillas
                        </label>
                        <select
                            value={shoeId ?? ''}
                            onChange={(e) => setShoeId(e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="">Sin zapatillas</option>
                            {shoes.map(shoe => (
                                <option key={shoe.id} value={shoe.id}>
                                    {shoe.nickname || `${shoe.brand} ${shoe.model}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notas
                        </label>
                        <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Serie de 400m..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                </div>
            </div>

            {/* Intervalos */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-700">Intervalos</h2>
                    <button
                        type="button"
                        onClick={handleAddInterval}
                        className="flex items-center text-green-600 hover:text-green-700 text-sm"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir
                    </button>
                </div>

                <div className="space-y-3">
                    {intervals.map((interval, index) => (
                        <RunIntervalForm
                            key={index}
                            index={index}
                            interval={interval}
                            onChange={handleUpdateInterval}
                            onRemove={handleRemoveInterval}
                            canRemove={intervals.length > 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NewRunPage