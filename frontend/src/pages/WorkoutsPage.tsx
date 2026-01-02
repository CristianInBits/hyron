import { useEffect, useState } from 'react'
import { ClipboardList, Plus } from 'lucide-react'
import { workoutService } from '../services/workoutService'
import type { WorkoutSummaryResponse, WorkoutDetailResponse, WorkoutCreateRequest } from '../types/workout'
import Modal from '../components/ui/Modal'
import WorkoutCard from '../components/workouts/WorkoutCard'
import WorkoutForm from '../components/workouts/WorkoutForm'

// TODO: Esto debería venir de un contexto o selección de usuario
const CURRENT_USER_ID = 1

function WorkoutsPage() {
    const [workouts, setWorkouts] = useState<WorkoutSummaryResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingWorkout, setEditingWorkout] = useState<WorkoutDetailResponse | null>(null)

    useEffect(() => {
        loadWorkouts()
    }, [])

    const loadWorkouts = async () => {
        try {
            setLoading(true)
            const data = await workoutService.getAll(CURRENT_USER_ID)
            setWorkouts(data)
            setError(null)
        } catch (err) {
            setError('Error al cargar workouts')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setEditingWorkout(null)
        setIsModalOpen(true)
    }

    const handleEdit = async (workout: WorkoutSummaryResponse) => {
        try {
            // Cargar el detalle completo para editar
            const detail = await workoutService.getById(CURRENT_USER_ID, workout.id)
            setEditingWorkout(detail)
            setIsModalOpen(true)
        } catch (err) {
            setError('Error al cargar workout')
            console.error(err)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este workout?')) return

        try {
            await workoutService.delete(CURRENT_USER_ID, id)
            await loadWorkouts()
        } catch (err) {
            setError('Error al eliminar workout')
            console.error(err)
        }
    }

    const handleSubmit = async (data: WorkoutCreateRequest) => {
        if (editingWorkout) {
            await workoutService.update(CURRENT_USER_ID, editingWorkout.id, data)
        } else {
            await workoutService.create(CURRENT_USER_ID, data)
        }
        setIsModalOpen(false)
        await loadWorkouts()
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingWorkout(null)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <ClipboardList className="w-7 h-7 mr-2 text-gray-700" />
                    <h1 className="text-2xl font-bold text-gray-800">Workouts</h1>
                </div>
                <button
                    className="flex items-center bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                    onClick={handleCreate}
                >
                    <Plus className="w-5 h-5 mr-1" />
                    <span>Nuevo</span>
                </button>
            </div>

            {loading && <p className="text-gray-500">Cargando...</p>}

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {!loading && !error && workouts.length === 0 && (
                <p className="text-gray-500">No hay workouts</p>
            )}

            {!loading && !error && workouts.length > 0 && (
                <div className="space-y-2">
                    {workouts.map(workout => (
                        <WorkoutCard
                            key={workout.id}
                            workout={workout}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingWorkout ? 'Editar Workout' : 'Nuevo Workout'}
            >
                <WorkoutForm
                    workout={editingWorkout}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    )
}

export default WorkoutsPage