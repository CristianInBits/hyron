import { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { workoutService } from '../services/workoutService'
import { runService } from '../services/runService'
import { swimService } from '../services/swimService'
import { gymService } from '../services/gymService'
import { hyroxService } from '../services/hyroxService'
import type { WorkoutSummaryResponse } from '../types/workout'
import type { RunDetailsResponse } from '../types/run'
import type { SwimDetailsResponse } from '../types/swim'
import type { GymDetailsResponse } from '../types/gym'
import type { HyroxDetailsResponse } from '../types/hyrox'
import WorkoutCard from '../components/workouts/WorkoutCard'
import { useNavigate } from 'react-router-dom'

type WorkoutsPageProps = {
    userId: number | null
}

type ExpandedDetails = {
    [workoutId: number]: RunDetailsResponse | SwimDetailsResponse | GymDetailsResponse | HyroxDetailsResponse | null
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

        if (expandedId === workout.id) {
            setExpandedId(null)
            return
        }

        setExpandedId(workout.id)

        if (!expandedDetails[workout.id]) {
            setLoadingDetails(true)
            try {
                let details = null
                switch (workout.type) {
                    case 'RUN':
                        details = await runService.getDetails(userId, workout.id)
                        break
                    case 'SWIM':
                        details = await swimService.getDetails(userId, workout.id)
                        break
                    case 'GYM':
                        details = await gymService.getDetails(userId, workout.id)
                        break
                    case 'HYROX':
                        details = await hyroxService.getDetails(userId, workout.id)
                        break
                }
                setExpandedDetails(prev => ({ ...prev, [workout.id]: details }))
            } catch (err) {
                console.error('Error loading details:', err)
                setExpandedDetails(prev => ({ ...prev, [workout.id]: null }))
            } finally {
                setLoadingDetails(false)
            }
        }
    }

    const handleEdit = (workout: WorkoutSummaryResponse) => {
        const routes: Record<string, string> = {
            RUN: '/new/run',
            SWIM: '/new/swim',
            GYM: '/new/gym',
            HYROX: '/new/hyrox',
        }
        navigate(`${routes[workout.type]}?workoutId=${workout.id}`)
    }

    const handleDelete = async (id: number) => {
        if (!userId) return
        if (!confirm('¿Estás seguro de eliminar este workout?')) return

        try {
            await workoutService.delete(userId, id)
            await loadWorkouts()
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
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <p className="text-gray-500">No hay workouts. Usa el botón + para crear uno.</p>
                </div>
            )}

            {!loading && !error && workouts.length > 0 && (
                <div className="space-y-3">
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