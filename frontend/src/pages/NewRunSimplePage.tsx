import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import RunHeader from '../components/run/RunHeader'
import WeekCalendar from '../components/ui/WeekCalendar'
import DistanceInput from '../components/ui/DistanceInput'
import IntensityCard from '../components/run/IntensityCard'
import ShoeSelector from '../components/run/ShoeSelector'
import NotesCollapsible from '../components/run/NotesCollapsible'
import SaveButton from '../components/run/SaveButton'

import { shoeService } from '../services/shoeService'
import { runService } from '../services/runService'
import { workoutService } from '../services/workoutService'
import type { ShoeSummaryResponse } from '../types/shoe'
import { getErrorMessage } from '../services/errorHandler'

type NewRunSimplePageProps = {
    userId: number | null
}

function NewRunSimplePage({ userId }: NewRunSimplePageProps) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const workoutIdParam = searchParams.get('workoutId')
    const scrollRef = useRef<HTMLDivElement>(null)

    // Estado del formulario
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [distanceMeters, setDistanceMeters] = useState(10000) // 10km por defecto
    const [durationSeconds, setDurationSeconds] = useState(3600) // 1h por defecto
    const [elevationMeters, setElevationMeters] = useState<number | null>(null)
    const [heartRate, setHeartRate] = useState<number | null>(null)
    const [feeling, setFeeling] = useState<number | null>(null)
    const [selectedShoeId, setSelectedShoeId] = useState<number | null>(null)
    const [notes, setNotes] = useState('')

    // Estado UI
    const [shoes, setShoes] = useState<ShoeSummaryResponse[]>([])
    const [loading, setLoading] = useState(false)
    const [isCompact, setIsCompact] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Detectar scroll para compactar header
    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                setIsCompact(scrollRef.current.scrollTop > 50)
            }
        }

        const ref = scrollRef.current
        ref?.addEventListener('scroll', handleScroll)
        return () => ref?.removeEventListener('scroll', handleScroll)
    }, [])

    // Cargar zapatillas
    useEffect(() => {
        if (userId) {
            loadShoes()
        }
    }, [userId])

    const loadShoes = async () => {
        if (!userId) return
        try {
            const data = await shoeService.getActiveSummary(userId)
            setShoes(data)
        } catch (err) {
            console.error('Error loading shoes:', err)
        }
    }

    const handleSave = async () => {
        if (!userId) return

        try {
            setLoading(true)
            setError(null)

            // Crear workout
            const startDateTime = new Date(selectedDate)
            startDateTime.setHours(new Date().getHours(), new Date().getMinutes())

            const workout = await workoutService.create(userId, {
                type: 'RUN',
                startDateTime: startDateTime.toISOString(),
            })

            await runService.saveDetails(userId, workout.id, {
                totalDistanceMeters: distanceMeters,
                totalElevationGain: elevationMeters,
                averageHr: heartRate,
                notes: notes.trim() || null,
                shoeId: selectedShoeId,
                intervals: [{
                    type: 'WORK',
                    distanceMeters: distanceMeters,
                    durationSeconds: durationSeconds, // El backend sumará esto
                }],
            })

            navigate('/workouts')
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    if (!userId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Selecciona un usuario</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header con transición */}
            <div className={`transition-all duration-300 ${isCompact ? 'sticky top-0 z-20' : ''}`}>
                {/* Botón volver */}
                <button
                    onClick={() => navigate('/workouts')}
                    className={`absolute top-4 left-4 z-30 p-2 rounded-full transition-colors ${isCompact ? 'bg-green-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <RunHeader
                    title="Rodaje"
                    subtitle="Registra tu carrera"
                    compact={isCompact}
                />
            </div>

            {/* Contenido scrollable */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto"
            >
                {error && (
                    <div className="mx-4 mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Calendario */}
                <WeekCalendar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                />

                {/* Distancia */}
                <DistanceInput
                    value={distanceMeters}
                    onChange={setDistanceMeters}
                />

                {/* Intensidad */}
                <IntensityCard
                    heartRate={heartRate}
                    onHeartRateChange={setHeartRate}
                    feeling={feeling}
                    onFeelingChange={setFeeling}
                />

                {/* Zapatillas */}
                <ShoeSelector
                    shoes={shoes}
                    selectedShoeId={selectedShoeId}
                    onSelectShoe={setSelectedShoeId}
                    onAddShoe={() => navigate('/shoes')}
                />

                {/* Notas */}
                <NotesCollapsible
                    value={notes}
                    onChange={setNotes}
                />

                {/* Espaciado para el botón sticky */}
                <div className="h-24" />
            </div>

            {/* Botón guardar */}
            <SaveButton
                onClick={handleSave}
                loading={loading}
                disabled={distanceMeters === 0}
            />
        </div>
    )
}

export default NewRunSimplePage