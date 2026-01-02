import { Dog, Fish, Dumbbell, Flame, Pencil, Trash2 } from 'lucide-react'
import type { WorkoutSummaryResponse } from '../../types/workout'

type WorkoutCardProps = {
    workout: WorkoutSummaryResponse
    onEdit: (workout: WorkoutSummaryResponse) => void
    onDelete: (id: number) => void
}

const workoutConfig = {
    RUN: { icon: Dog, color: 'text-green-500', bg: 'bg-green-50', label: 'Run' },
    SWIM: { icon: Fish, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Swim' },
    GYM: { icon: Dumbbell, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Gym' },
    HYROX: { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Hyrox' },
}

function WorkoutCard({ workout, onEdit, onDelete }: WorkoutCardProps) {
    const config = workoutConfig[workout.type]
    const Icon = config.icon

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            {/* Icono del tipo */}
            <div className={`p-3 rounded-lg ${config.bg} mr-4`}>
                <Icon className={`w-6 h-6 ${config.color}`} />
            </div>

            {/* Info */}
            <div className="flex-1">
                <p className="font-medium text-gray-800">{config.label}</p>
                <p className="text-sm text-gray-500">{formatDate(workout.startDateTime)}</p>
                {workout.location && (
                    <p className="text-sm text-gray-400">{workout.location}</p>
                )}
            </div>

            {/* RPE Badge */}
            {workout.globalRpe && (
                <div className="mr-4">
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        RPE {workout.globalRpe}
                    </span>
                </div>
            )}

            {/* Acciones */}
            <div className="flex space-x-2">
                <button
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => onEdit(workout)}
                >
                    <Pencil className="w-5 h-5" />
                </button>
                <button
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    onClick={() => onDelete(workout.id)}
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default WorkoutCard