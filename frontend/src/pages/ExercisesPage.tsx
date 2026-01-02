import { useEffect, useState } from 'react'
import { Dumbbell, Plus } from 'lucide-react'
import { exerciseService } from '../services/exerciseService'
import type { ExerciseResponse, ExerciseCreateRequest, ExerciseUpdateRequest, MuscleGroup } from '../types/exercise'
import { muscleGroupLabels } from '../types/exercise'
import Modal from '../components/ui/Modal'
import ExerciseCard from '../components/exercises/ExerciseCard'
import ExerciseForm from '../components/exercises/ExerciseForm'

type ExercisesPageProps = {
    userId: number | null
}

const muscleGroups: MuscleGroup[] = [
    'CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'ABS', 'CARDIO', 'FULL_BODY', 'OTHER'
]

function ExercisesPage({ userId }: ExercisesPageProps) {
    const [exercises, setExercises] = useState<ExerciseResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filterMuscleGroup, setFilterMuscleGroup] = useState<MuscleGroup | ''>('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingExercise, setEditingExercise] = useState<ExerciseResponse | null>(null)

    useEffect(() => {
        if (userId) {
            loadExercises()
        }
    }, [userId])

    const loadExercises = async () => {
        if (!userId) return

        try {
            setLoading(true)
            const data = await exerciseService.getAll(userId)
            setExercises(data)
            setError(null)
        } catch (err) {
            setError('Error al cargar ejercicios')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setEditingExercise(null)
        setIsModalOpen(true)
    }

    const handleEdit = (exercise: ExerciseResponse) => {
        setEditingExercise(exercise)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!userId) return
        if (!confirm('¿Estás seguro de eliminar este ejercicio?')) return

        try {
            await exerciseService.delete(userId, id)
            await loadExercises()
        } catch (err) {
            setError('Error al eliminar ejercicio')
            console.error(err)
        }
    }

    const handleToggleActive = async (exercise: ExerciseResponse) => {
        if (!userId) return

        try {
            const updateData: ExerciseUpdateRequest = { active: !exercise.active }
            await exerciseService.update(userId, exercise.id, updateData)
            await loadExercises()
        } catch (err) {
            setError('Error al actualizar ejercicio')
            console.error(err)
        }
    }

    const handleSubmit = async (data: ExerciseCreateRequest) => {
        if (!userId) return

        if (editingExercise) {
            const updateData: ExerciseUpdateRequest = { ...data }
            await exerciseService.update(userId, editingExercise.id, updateData)
        } else {
            await exerciseService.create(userId, data)
        }
        setIsModalOpen(false)
        await loadExercises()
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingExercise(null)
    }

    // Filtrar ejercicios
    const filteredExercises = filterMuscleGroup
        ? exercises.filter(e => e.muscleGroup === filterMuscleGroup)
        : exercises

    // Separar activos e inactivos
    const activeExercises = filteredExercises.filter(e => e.active)
    const inactiveExercises = filteredExercises.filter(e => !e.active)

    if (!userId) {
        return (
            <div>
                <div className="flex items-center mb-4">
                    <Dumbbell className="w-7 h-7 mr-2 text-purple-600" />
                    <h1 className="text-2xl font-bold text-gray-800">Ejercicios</h1>
                </div>
                <p className="text-gray-500">Selecciona un usuario para ver sus ejercicios</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Dumbbell className="w-7 h-7 mr-2 text-purple-600" />
                    <h1 className="text-2xl font-bold text-gray-800">Ejercicios</h1>
                </div>
                <button
                    className="flex items-center bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
                    onClick={handleCreate}
                >
                    <Plus className="w-5 h-5 mr-1" />
                    <span>Nuevo</span>
                </button>
            </div>

            {/* Filtro por grupo muscular */}
            <div className="mb-4">
                <select
                    value={filterMuscleGroup}
                    onChange={(e) => setFilterMuscleGroup(e.target.value as MuscleGroup | '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                    <option value="">Todos los grupos</option>
                    {muscleGroups.map(mg => (
                        <option key={mg} value={mg}>
                            {muscleGroupLabels[mg]}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <p className="text-gray-500">Cargando...</p>}

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {!loading && !error && filteredExercises.length === 0 && (
                <p className="text-gray-500">No hay ejercicios</p>
            )}

            {!loading && !error && filteredExercises.length > 0 && (
                <>
                    {/* Ejercicios activos */}
                    {activeExercises.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {activeExercises.map(exercise => (
                                <ExerciseCard
                                    key={exercise.id}
                                    exercise={exercise}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onToggleActive={handleToggleActive}
                                />
                            ))}
                        </div>
                    )}

                    {/* Ejercicios inactivos */}
                    {inactiveExercises.length > 0 && (
                        <>
                            <h2 className="text-sm font-medium text-gray-500 mb-3">Inactivos</h2>
                            <div className="space-y-3">
                                {inactiveExercises.map(exercise => (
                                    <ExerciseCard
                                        key={exercise.id}
                                        exercise={exercise}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onToggleActive={handleToggleActive}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
            >
                <ExerciseForm
                    exercise={editingExercise}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    )
}

export default ExercisesPage