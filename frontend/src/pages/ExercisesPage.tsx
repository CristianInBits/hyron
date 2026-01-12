import { useEffect, useState } from 'react'
import { Dumbbell, Plus, Filter } from 'lucide-react'
import { exerciseService } from '../services/exerciseService'
import { muscleGroupLabels } from '../types/exercise'
import type { ExerciseResponse, ExerciseCreateRequest, ExerciseUpdateRequest, MuscleGroup } from '../types/exercise'
import Modal from '../components/ui/Modal'
import ExerciseCard from '../components/exercises/ExerciseCard'
import ExerciseForm from '../components/exercises/ExerciseForm'
import { Select } from '../components/ui'

type ExercisesPageProps = {
    userId: number | null
}

function ExercisesPage({ userId }: ExercisesPageProps) {
    const [exercises, setExercises] = useState<ExerciseResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingExercise, setEditingExercise] = useState<ExerciseResponse | null>(null)

    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'ALL'>('ALL')

    useEffect(() => {
        if (userId) loadExercises()
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

    const handleToggleActive = async (exercise: ExerciseResponse) => {
        if (!userId) return
        try {
            await exerciseService.update(userId, exercise.id, { active: !exercise.active })
            await loadExercises()
        } catch (err) {
            setError('Error al actualizar estado del ejercicio')
        }
    }

    const handleDelete = async (id: number) => {
        if (!userId) return
        if (!confirm('¿Seguro que quieres eliminar este ejercicio? Se perderá el historial asociado.')) return
        try {
            await exerciseService.delete(userId, id)
            await loadExercises()
        } catch (err) {
            setError('Error al eliminar ejercicio')
        }
    }

    const handleSubmit = async (data: ExerciseCreateRequest) => {
        if (!userId) return
        try {
            if (editingExercise) {
                const updateData: ExerciseUpdateRequest = { ...data }
                await exerciseService.update(userId, editingExercise.id, updateData)
            } else {
                await exerciseService.create(userId, data)
            }
            setIsModalOpen(false)
            await loadExercises()
        } catch (err) {
            console.error(err)
        }
    }

    const filteredExercises = selectedMuscleGroup === 'ALL'
        ? exercises
        : exercises.filter(ex => ex.muscleGroup === selectedMuscleGroup)

    const activeExercises = filteredExercises.filter(ex => ex.active)
    const inactiveExercises = filteredExercises.filter(ex => !ex.active)

    const muscleGroups = Object.keys(muscleGroupLabels) as MuscleGroup[]

    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Dumbbell className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Ejercicios</h2>
                <p className="text-gray-500">Selecciona un usuario para ver sus ejercicios</p>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <Dumbbell className="w-6 h-6 text-purple-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Ejercicios</h1>
                </div>

                <div className="flex gap-2">
                    {/* Selector de Filtro */}
                    <div className="relative">
                        <Select
                            value={selectedMuscleGroup}
                            onChange={(e) => setSelectedMuscleGroup(e.target.value as MuscleGroup | 'ALL')}
                            variant="purple"
                            className="pl-9"
                        >
                            <option value="ALL">Todos los grupos</option>
                            {muscleGroups.map(mg => (
                                <option key={mg} value={mg}>{muscleGroupLabels[mg]}</option>
                            ))}
                        </Select>
                        <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                    </div>

                    <button
                        onClick={handleCreate}
                        className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 sm:mr-1" />
                        <span className="hidden sm:inline">Nuevo</span>
                    </button>
                </div>
            </div>

            {loading && <p className="text-gray-500">Cargando...</p>}

            {error && (
                <div className="text-red-600 mb-4 bg-red-50 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* Lista Vacía */}
                    {filteredExercises.length === 0 && (
                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No se encontraron ejercicios.</p>
                            <button
                                onClick={handleCreate}
                                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Crear ejercicio
                            </button>
                        </div>
                    )}

                    {/* Activos */}
                    {activeExercises.length > 0 && (
                        <div className="grid gap-3 mb-8 sm:grid-cols-1 lg:grid-cols-2">
                            {activeExercises.map(ex => (
                                <ExerciseCard
                                    key={ex.id}
                                    exercise={ex}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onToggleActive={handleToggleActive}
                                />
                            ))}
                        </div>
                    )}

                    {/* Inactivos */}
                    {inactiveExercises.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                                Archivados / Inactivos
                                <span className="ml-2 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                                    {inactiveExercises.length}
                                </span>
                            </h2>
                            <div className="grid gap-3 opacity-75 sm:grid-cols-1 lg:grid-cols-2">
                                {inactiveExercises.map(ex => (
                                    <ExerciseCard
                                        key={ex.id}
                                        exercise={ex}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onToggleActive={handleToggleActive}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
            >
                <ExerciseForm
                    exercise={editingExercise}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default ExercisesPage