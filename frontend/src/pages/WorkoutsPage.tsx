import { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { workoutService } from '../services/workoutService'
import { runService } from '../services/runService'
import type { WorkoutSummaryResponse } from '../types/workout'
import type { RunDetailsResponse } from '../types/run'
import WorkoutCard from '../components/workouts/WorkoutCard'
import { useNavigate } from 'react-router-dom'
import { swimService } from '../services/swimService'
import type { SwimDetailsResponse } from '../types/swim'

type WorkoutsPageProps = {
    userId: number | null
}

type ExpandedDetails = {
    [workoutId: number]: RunDetailsResponse | SwimDetailsResponse | null
}

function WorkoutsPage({ userId }: WorkoutsPageProps) {
    const navigate = useNavigate()
    const [workouts, setWorkouts] = useState<WorkoutSummaryResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [expandedDetails, setExpandedDetails] = useState<ExpandedDetails>({})
    const [loadingDetails, setLoadingDetails] = useState(false)

    useEffect(() => {
        if (userId) {
            loadWorkouts()
        }
    }, [userId])

    const loadWorkouts = async () => {
        if (!userId) return

        try {
            setLoading(true)
            const data = await workoutService.getAll(userId)
            setWorkouts(data)
            setError(null)
        } catch (err) {
            setError('Error al cargar workouts')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleExpand = async (workout: WorkoutSummaryResponse) => {
        if (!userId) return

        // Si ya está expandido, colapsar
        if (expandedId === workout.id) {
            setExpandedId(null)
            return
        }

        // Expandir y cargar detalles si no los tenemos
        setExpandedId(workout.id)

        if (!expandedDetails[workout.id]) {
            setLoadingDetails(true)
            try {
                if (workout.type === 'RUN') {
                    const details = await runService.getDetails(userId, workout.id)
                    setExpandedDetails(prev => ({ ...prev, [workout.id]: details }))
                } else if (workout.type === 'SWIM') {
                    const details = await swimService.getDetails(userId, workout.id)
                    setExpandedDetails(prev => ({ ...prev, [workout.id]: details }))
                }
                // TODO: Añadir otros tipos (GYM, HYROX)
            } catch (err) {
                console.error('Error loading details:', err)
                setExpandedDetails(prev => ({ ...prev, [workout.id]: null }))
            } finally {
                setLoadingDetails(false)
            }
        }
    }

    const handleEdit = (workout: WorkoutSummaryResponse) => {
        switch (workout.type) {
            case 'RUN':
                navigate(`/new/run?workoutId=${workout.id}`)
                break
            case 'SWIM':
                navigate(`/new/swim?workoutId=${workout.id}`)
                break
            case 'GYM':
                navigate(`/new/gym?workoutId=${workout.id}`)
                break
            case 'HYROX':
                navigate(`/new/hyrox?workoutId=${workout.id}`)
                break
        }
    }

    const handleDelete = async (id: number) => {
        if (!userId) return
        if (!confirm('¿Estás seguro de eliminar este workout?')) return

        try {
            await workoutService.delete(userId, id)
            await loadWorkouts()
            // Limpiar detalles expandidos
            setExpandedId(null)
            setExpandedDetails(prev => {
                const { [id]: _, ...rest } = prev
                return rest
            })
        } catch (err) {
            setError('Error al eliminar workout')
            console.error(err)
        }
    }

    if (!userId) {
        return (
            <div>
                <div className="flex items-center mb-4">
                    <ClipboardList className="w-7 h-7 mr-2 text-gray-700" />
                    <h1 className="text-2xl font-bold text-gray-800">Workouts</h1>
                </div>
                <p className="text-gray-500">Selecciona un usuario para ver sus workouts</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center mb-4">
                <ClipboardList className="w-7 h-7 mr-2 text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-800">Workouts</h1>
            </div>

            {loading && <p className="text-gray-500">Cargando...</p>}

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {!loading && !error && workouts.length === 0 && (
                <p className="text-gray-500">No hay workouts. Usa el botón + para crear uno.</p>
            )}

            {!loading && !error && workouts.length > 0 && (
                <div className="space-y-2">
                    {workouts.map(workout => (
                        <WorkoutCard
                            key={workout.id}
                            workout={workout}
                            isExpanded={expandedId === workout.id}
                            details={expandedDetails[workout.id]}
                            loadingDetails={loadingDetails && expandedId === workout.id}
                            onToggleExpand={handleToggleExpand}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default WorkoutsPage