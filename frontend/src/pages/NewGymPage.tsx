import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Dumbbell, Plus, ArrowLeft, Save } from 'lucide-react'
import { gymService } from '../services/gymService'
import { workoutService } from '../services/workoutService'
import { exerciseService } from '../services/exerciseService'
import type { GymDetailsCreateRequest } from '../types/gym'
import type { ExerciseSummaryResponse } from '../types/exercise'
import GymExerciseForm from '../components/gym/GymExerciseForm'
import type { ExerciseFormData } from '../components/gym/GymExerciseForm'
import type { SetFormData } from '../components/gym/GymSetForm'
import { getErrorMessage } from '../services/errorHandler'
import DurationInput from '../components/ui/DurationInput'

type NewGymPageProps = {
    userId: number | null
}

const emptySet: SetFormData = {
    type: 'WORK',
    weightKg: null,
    reps: null,
    executionSeconds: null,
    rpe: null,
    restSeconds: null,
}

const emptyExercise: ExerciseFormData = {
    exerciseId: null,
    exerciseName: '',
    supersetId: null,
    notes: '',
    sets: [{ ...emptySet }],
}

function NewGymPage({ userId }: NewGymPageProps) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const workoutIdParam = searchParams.get('workoutId')

    // Estado del formulario
    const [workoutId, setWorkoutId] = useState<number | null>(workoutIdParam ? parseInt(workoutIdParam) : null)
    const [workoutDate, setWorkoutDate] = useState<string>(() => {
        const now = new Date()
        return now.toISOString().slice(0, 16)
    })
    const [notes, setNotes] = useState('')
    const [totalDuration, setTotalDuration] = useState<number>(0)
    const [exercisesList, setExercisesList] = useState<ExerciseFormData[]>([{ ...emptyExercise }])

    // Catálogo de ejercicios
    const [availableExercises, setAvailableExercises] = useState<ExerciseSummaryResponse[]>([])

    // Estado de UI
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

            // Cargar catálogo de ejercicios activos
            const exercises = await exerciseService.getActive(userId)
            setAvailableExercises(exercises)

            if (workoutIdParam) {
                const wId = parseInt(workoutIdParam)
                setWorkoutId(wId)

                // Cargar datos del workout base
                try {
                    const workoutData = await workoutService.getById(userId, wId)
                    setWorkoutDate(workoutData.startDateTime.slice(0, 16))
                } catch {
                    // Si falla, usar fecha actual
                }

                // Cargar detalles del gym
                try {
                    const details = await gymService.getDetails(userId, wId)
                    setNotes(details.notes ?? '')
                    setTotalDuration(details.totalDurationSeconds ?? 0)

                    if (details.exercises.length > 0) {
                        setExercisesList(details.exercises.map(ex => ({
                            exerciseId: ex.exerciseId,
                            exerciseName: ex.exerciseName,
                            supersetId: ex.supersetId,
                            notes: ex.notes ?? '',
                            sets: ex.sets.map(s => ({
                                type: s.type,
                                weightKg: s.weightKg,
                                reps: s.reps,
                                executionSeconds: s.executionSeconds,
                                rpe: s.rpe,
                                restSeconds: s.restSeconds,
                            })),
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

    // Generar UUID simple
    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    // Calcular grupos de superseries con etiquetas (A, B, C...)
    const getSupersetGroups = (): Map<string, string> => {
        const groups = new Map<string, string>()
        const supersetIds = [...new Set(exercisesList.filter(ex => ex.supersetId).map(ex => ex.supersetId!))]

        supersetIds.forEach((id, index) => {
            groups.set(id, String.fromCharCode(65 + index)) // A, B, C...
        })

        return groups
    }

    const supersetGroups = getSupersetGroups()

    const handleAddExercise = () => {
        setExercisesList([...exercisesList, { ...emptyExercise, sets: [{ ...emptySet }] }])
    }

    const handleUpdateExercise = (index: number, exercise: ExerciseFormData) => {
        const updated = [...exercisesList]
        updated[index] = exercise
        setExercisesList(updated)
    }

    const handleRemoveExercise = (index: number) => {
        setExercisesList(exercisesList.filter((_, i) => i !== index))
    }

    const handleCreateSuperset = (exerciseIndex: number) => {
        const newSupersetId = generateUUID()
        const updated = [...exercisesList]
        updated[exerciseIndex] = { ...updated[exerciseIndex], supersetId: newSupersetId }
        setExercisesList(updated)
    }

    const handleJoinSuperset = (exerciseIndex: number, supersetId: string) => {
        const updated = [...exercisesList]
        updated[exerciseIndex] = { ...updated[exerciseIndex], supersetId }
        setExercisesList(updated)
    }

    const handleLeaveSuperset = (exerciseIndex: number) => {
        const updated = [...exercisesList]
        const leavingSupersetId = updated[exerciseIndex].supersetId
        updated[exerciseIndex] = { ...updated[exerciseIndex], supersetId: null }

        // Si solo queda 1 ejercicio en esa superserie, quitarlo también
        if (leavingSupersetId) {
            const remainingInSuperset = updated.filter(ex => ex.supersetId === leavingSupersetId)
            if (remainingInSuperset.length === 1) {
                const lastExIndex = updated.findIndex(ex => ex.supersetId === leavingSupersetId)
                updated[lastExIndex] = { ...updated[lastExIndex], supersetId: null }
            }
        }

        setExercisesList(updated)
    }

    const handleSubmit = async () => {
        if (!userId) return

        // Validar que hay al menos un ejercicio con ejercicio seleccionado
        const validExercises = exercisesList.filter(ex => ex.exerciseId !== null)
        if (validExercises.length === 0) {
            setError('Añade al menos un ejercicio')
            return
        }

        // Validar que cada ejercicio tiene al menos una serie con reps o tiempo
        for (const ex of validExercises) {
            const validSets = ex.sets.filter(s => s.reps !== null || s.executionSeconds !== null)
            if (validSets.length === 0) {
                setError(`El ejercicio "${ex.exerciseName}" debe tener al menos una serie con repeticiones`)
                return
            }
        }

        try {
            setLoading(true)
            setError(null)

            // Crear o actualizar workout
            let wId = workoutId
            if (!wId) {
                const workout = await workoutService.create(userId, {
                    type: 'GYM',
                    startDateTime: new Date(workoutDate).toISOString(),
                })
                wId = workout.id
                setWorkoutId(wId)
            } else {
                await workoutService.update(userId, wId, {
                    startDateTime: new Date(workoutDate).toISOString(),
                })
            }

            // Preparar request
            const request: GymDetailsCreateRequest = {
                totalDurationSeconds: totalDuration > 0 ? totalDuration : null,
                notes: notes.trim() || null,
                exercises: validExercises.map(ex => ({
                    exerciseId: ex.exerciseId!,
                    supersetId: ex.supersetId,
                    notes: ex.notes.trim() || null,
                    sets: ex.sets
                        .filter(s => s.reps !== null || s.executionSeconds !== null)
                        .map(s => ({
                            type: s.type,
                            weightKg: s.weightKg,
                            reps: s.reps,
                            executionSeconds: s.executionSeconds,
                            rpe: s.rpe,
                            restSeconds: s.restSeconds,
                        })),
                })),
            }

            await gymService.saveDetails(userId, wId, request)
            navigate('/workouts')
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    // Pantalla sin usuario
    if (!userId) {
        return (
            <div className="bg-purple-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <Dumbbell className="w-10 h-10 mr-3 text-purple-600" />
                    <h1 className="text-2xl font-bold text-purple-700">Nuevo Gym</h1>
                </div>
                <p className="text-purple-600">Selecciona un usuario primero</p>
            </div>
        )
    }

    // Pantalla de carga
    if (loadingData) {
        return (
            <div className="bg-purple-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <Dumbbell className="w-10 h-10 mr-3 text-purple-600" />
                    <h1 className="text-2xl font-bold text-purple-700">Nuevo Gym</h1>
                </div>
                <p className="text-purple-600">Cargando...</p>
            </div>
        )
    }

    // Sin ejercicios en el catálogo
    if (availableExercises.length === 0) {
        return (
            <div className="bg-purple-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/workouts')}
                        className="p-2 mr-2 text-purple-600 hover:bg-purple-100 rounded-lg"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <Dumbbell className="w-10 h-10 mr-3 text-purple-600" />
                    <h1 className="text-2xl font-bold text-purple-700">Nuevo Gym</h1>
                </div>
                <div className="bg-white rounded-lg p-6 text-center">
                    <p className="text-gray-600 mb-4">No tienes ejercicios en tu catálogo.</p>
                    <button
                        onClick={() => navigate('/exercises')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Crear ejercicios
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-purple-50 min-h-screen -m-4 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/workouts')}
                        className="p-2 mr-2 text-purple-600 hover:bg-purple-100 rounded-lg"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <Dumbbell className="w-10 h-10 mr-3 text-purple-600" />
                    <h1 className="text-2xl font-bold text-purple-700">
                        {workoutId ? 'Editar Gym' : 'Nuevo Gym'}
                    </h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
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

            {/* Fecha */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha y hora del entrenamiento
                </label>
                <input
                    type="datetime-local"
                    value={workoutDate}
                    onChange={(e) => setWorkoutDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
            </div>

            {/* Duración y Notas */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duración total (opcional)
                    </label>
                    <DurationInput
                        value={totalDuration}
                        onChange={setTotalDuration}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Si no lo indicas, se calculará de los tiempos de las series
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas del entrenamiento (opcional)
                    </label>
                    <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Día de pecho y tríceps..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>
            </div>

            {/* Ejercicios */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-700">Ejercicios</h2>
                    <button
                        type="button"
                        onClick={handleAddExercise}
                        className="flex items-center text-purple-600 hover:text-purple-700 text-sm"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir ejercicio
                    </button>
                </div>

                <div className="space-y-3">
                    {exercisesList.map((exercise, index) => (
                        <GymExerciseForm
                            key={index}
                            index={index}
                            exercise={exercise}
                            exercises={availableExercises}
                            supersetGroups={supersetGroups}
                            onChange={handleUpdateExercise}
                            onRemove={handleRemoveExercise}
                            onCreateSuperset={handleCreateSuperset}
                            onJoinSuperset={handleJoinSuperset}
                            onLeaveSuperset={handleLeaveSuperset}
                            canRemove={exercisesList.length > 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NewGymPage