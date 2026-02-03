import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dog } from 'lucide-react'

// --- COMPONENTES UI ---
import ActivityHeader from '../components/layout/ActivityHeader'
import WeekCalendar from '../components/calendar/WeekCalendar'
import DurationCard from '../components/cards/DurationCard'
import DistanceInput from '../components/inputs/DistanceInput'
import HeartRateInput from '../components/inputs/HeartRateInput'
import ElevationCard from '../components/cards/ElevationCard'
import ShoeSelector from '../components/selectors/ShoeSelector'
import FeelingCard from '../components/cards/FeelingCard'
import NotesCard from '../components/cards/NotesCard'
import SaveButton from '../components/actions/SaveButton'

// --- HELPERS ---
import { getFeelingLabel } from '../constants/activity'

// --- SERVICIOS ---
import { shoeService } from '../services/shoeService'
import { workoutService } from '../services/workoutService'
import { runService } from '../services/runService'
import { getErrorMessage } from '../services/errorHandler'

// --- TIPOS ---
import type { Shoe } from '../types/shoe'
import type {
    RunDetailsCreateRequest,
    RunIntervalRequest,
    RunIntervalType
} from '../types/run'

type Props = {
    userId: number | null
}

export default function NewRunPage({ userId }: Props) {
    const navigate = useNavigate()

    // --- ESTADOS DE DATOS ---
    const [date, setDate] = useState(new Date())
    const [duration, setDuration] = useState(0) // segundos
    const [distance, setDistance] = useState(0) // metros
    const [heartRate, setHeartRate] = useState<number | null>(null)
    const [elevation, setElevation] = useState<number | null>(null)
    const [feeling, setFeeling] = useState<number | null>(null)
    const [notes, setNotes] = useState('')

    // Material
    const [shoes, setShoes] = useState<Shoe[]>([])
    const [selectedShoeId, setSelectedShoeId] = useState<number | null>(null)

    // UI States
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isHeaderCompact, setIsHeaderCompact] = useState(false)

    // --- EFECTO DE SCROLL ---
    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY
            if (currentScroll > 40 && !isHeaderCompact) {
                setIsHeaderCompact(true)
            } else if (currentScroll < 10 && isHeaderCompact) {
                setIsHeaderCompact(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isHeaderCompact])

    // --- 1. CARGA INICIAL ---
    useEffect(() => {
        const loadData = async () => {
            if (!userId) return
            setIsLoadingData(true)
            try {
                // Cargar zapatillas
                const shoesData = await shoeService.getMyShoes()
                setShoes(shoesData.content)
            } catch (err) {
                console.error("Error cargando datos:", err)
            } finally {
                setIsLoadingData(false)
            }
        }
        loadData()
    }, [userId])

    // --- 2. GUARDADO (Lógica Robusta) ---
    const handleSubmit = async () => {
        if (!userId) return

        // Validaciones básicas
        if (duration === 0) {
            alert("La duración es obligatoria") // Podrías usar un estado de error visual mejor
            return
        }

        setIsSaving(true)
        setError(null)

        try {
            // A. Crear el WORKOUT padre
            // Nota: Usamos la fecha seleccionada en el calendario combinada con la hora actual
            // o simplemente la fecha seleccionada a las 12:00, depende de tu preferencia.
            // Aquí uso la fecha del calendario tal cual (que suele estar a las 00:00 o la hora actual al inicializarse)
            const workout = await workoutService.create(userId, {
                type: 'RUN',
                startDateTime: date.toISOString(),
            })
            const workoutId = workout.id

            // --- LÓGICA DE NOTAS + FEELING ---
            let finalNotes = notes.trim()

            // Si el usuario seleccionó una sensación, la añadimos al principio de la nota
            if (feeling) {
                const label = getFeelingLabel(feeling)
                const feelingText = `[RPE: ${feeling}/5 - ${label}]`

                // Si ya había notas, lo ponemos encima con un salto de línea
                finalNotes = finalNotes
                    ? `${feelingText}\n${finalNotes}`
                    : feelingText
            }

            // B. Preparar el Intervalo Único (Modo Simple)
            const singleInterval: RunIntervalRequest = {
                type: 'WORK' as RunIntervalType,
                durationSeconds: duration,
                distanceMeters: distance > 0 ? distance : null, // Enviar null si es 0
                averageHr: heartRate,
                elevationGain: elevation,
                notes: null, // Las notas van al nivel superior en modo simple
                cadenceSpm: null
            }

            // C. Preparar el Payload de Detalles
            const detailsPayload: RunDetailsCreateRequest = {
                totalDistanceMeters: distance > 0 ? distance : null,
                totalElevationGain: elevation,
                averageHr: heartRate,
                shoeId: selectedShoeId,
                notes: finalNotes || null,
                intervals: [singleInterval]
            }

            // D. Guardar Detalles
            await runService.saveDetails(userId, workoutId, detailsPayload)

            // E. Redirigir
            navigate('/workouts')

        } catch (err) {
            const msg = getErrorMessage(err)
            setError(msg)
            console.error("Error guardando:", err)
            // Aquí podrías mostrar un Toast o Alert
            alert(`Error: ${msg}`)
        } finally {
            setIsSaving(false)
        }
    }

    if (!userId) return <div className="p-4">Cargando usuario...</div>

    return (
        <div className="min-h-screen bg-gray-50 pb-32">

            {/* 1. HEADER FIXO (Fuera del flujo) */}
            {/* Cambiamos 'sticky' por 'fixed' y aseguramos width full */}
            <div className="fixed top-14 left-0 right-0 z-30 transition-all duration-300">
                <ActivityHeader
                    title="Registrar Carrera"
                    subtitle="Rodaje simple"
                    label="RUNNING"
                    icon={Dog}
                    color="green"
                    compact={isHeaderCompact}
                />
            </div>

            {/* 2. ESPACIADOR FANTASMA (Placeholder) */}
            {/* Este div ocupa el espacio que ocuparía el header ABIERTO.
                Así el contenido empieza más abajo y no se esconde detrás.
                Ajusta la altura (h-48 o h-52) según lo que mida tu ActivityHeader abierto. */}
            <div className="h-44 sm:h-52 w-full" aria-hidden="true" />

            {/* CALENDARIO */}
            <div className='relative z-10 shadow-sm'>
                <WeekCalendar
                    selectedDate={date}
                    onSelectDate={setDate}
                    color='green'
                />
            </div>

            {/* CONTENEDOR PRINCIPAL */}
            <main className="max-w-md mx-auto pt-6 px-4 space-y-5">

                {/* 1. DISTANCIA */}
                <DistanceInput
                    value={distance}
                    onChange={setDistance}
                    color='green'
                    mode='long'
                    step={500}
                />

                {/* 2. DURACIÓN */}
                <DurationCard
                    value={duration}
                    onChange={setDuration}
                    format="hh:mm:ss"
                    color="green"
                />

                {/* 3. GRID: PULSO Y DESNIVEL */}
                <div className='grid grid-cols-2 gap-3 h-32'>
                    <HeartRateInput
                        value={heartRate}
                        onChange={setHeartRate}
                        color='green'
                    />
                    <ElevationCard
                        value={elevation}
                        onChange={setElevation}
                        color="green"
                    />
                </div>

                <hr className="border-gray-200 border-dashed my-2" />

                {/* 4. MATERIAL */}
                <div className="mt-8 pt-6 border-t border-gray-100 -mx-4">
                    {isLoadingData ? (
                        <div className="flex gap-3 overflow-hidden px-4">
                            {[1, 2].map(i => <div key={i} className="w-36 h-48 bg-gray-200 rounded-2xl animate-pulse flex-shrink-0" />)}
                        </div>
                    ) : (
                        <ShoeSelector
                            shoes={shoes}
                            selectedShoeId={selectedShoeId}
                            onSelectShoe={setSelectedShoeId}
                            onAddShoe={() => navigate('/shoes')}
                            color="green"
                        />
                    )}
                </div>

                <hr className="border-gray-200 border-dashed my-2" />

                {/* 5. INTENSIDAD */}
                <FeelingCard
                    value={feeling}
                    onChange={setFeeling}
                    color="green"
                />

                {/* 6. NOTAS */}
                <NotesCard
                    value={notes}
                    onChange={setNotes}
                    color="green"
                />

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                {/* 7. GUARDAR */}
                <div className="pt-2">
                    <SaveButton
                        onClick={handleSubmit}
                        isLoading={isSaving}
                        disabled={duration === 0 || distance === 0}
                        label="Guardar Carrera"
                        color="green"
                    />
                </div>

            </main>
        </div>
    )
}