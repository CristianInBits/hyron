import { Dog, Fish, Dumbbell, Flame, Trash2, ChevronDown, ChevronUp, Footprints } from 'lucide-react'
import type { WorkoutSummaryResponse } from '../../types/workout'
import type { RunDetailsResponse } from '../../types/run'
import { runIntervalTypeLabels } from '../../types/run'

type WorkoutCardProps = {
    workout: WorkoutSummaryResponse
    isExpanded: boolean
    details: RunDetailsResponse | null // Añadiremos más tipos después
    loadingDetails: boolean
    onToggleExpand: (workout: WorkoutSummaryResponse) => void
    onDelete: (id: number) => void
}

const workoutConfig = {
    RUN: { icon: Dog, color: 'text-green-500', bg: 'bg-green-50', label: 'Run' },
    SWIM: { icon: Fish, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Swim' },
    GYM: { icon: Dumbbell, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Gym' },
    HYROX: { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Hyrox' },
}

function WorkoutCard({ workout, isExpanded, details, loadingDetails, onToggleExpand, onDelete }: WorkoutCardProps) {
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

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const formatDistance = (meters: number | null) => {
        if (meters === null) return '-'
        if (meters >= 1000) {
            return `${(meters / 1000).toFixed(2)} km`
        }
        return `${meters} m`
    }

    const formatPace = (secondsPerKm: number | null) => {
        if (secondsPerKm === null) return '-'
        const mins = Math.floor(secondsPerKm / 60)
        const secs = secondsPerKm % 60
        return `${mins}:${secs.toString().padStart(2, '0')} /km`
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Cabecera clickeable */}
            <div
                className="p-4 flex items-center cursor-pointer hover:bg-gray-50"
                onClick={() => onToggleExpand(workout)}
            >
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
                <div className="flex items-center space-x-2">
                    <button
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete(workout.id)
                        }}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            </div>

            {/* Detalles expandidos */}
            {isExpanded && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                    {loadingDetails && (
                        <p className="text-sm text-gray-500">Cargando detalles...</p>
                    )}

                    {!loadingDetails && !details && (
                        <p className="text-sm text-gray-500">No hay detalles disponibles</p>
                    )}

                    {!loadingDetails && details && workout.type === 'RUN' && (
                        <RunDetails details={details as RunDetailsResponse} />
                    )}

                    {/* TODO: Añadir componentes para SWIM, GYM, HYROX */}
                </div>
            )}
        </div>
    )
}

// Componente para mostrar detalles de Run
function RunDetails({ details }: { details: RunDetailsResponse }) {
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const formatDistance = (meters: number | null) => {
        if (meters === null) return '-'
        if (meters >= 1000) {
            return `${(meters / 1000).toFixed(2)} km`
        }
        return `${meters} m`
    }

    const formatPace = (secondsPerKm: number | null) => {
        if (secondsPerKm === null) return '-'
        const mins = Math.floor(secondsPerKm / 60)
        const secs = secondsPerKm % 60
        return `${mins}:${secs.toString().padStart(2, '0')} /km`
    }

    return (
        <div className="space-y-4">
            {/* Resumen */}
            <div className="grid grid-cols-3 gap-3">
                {details.totalDistanceMeters && (
                    <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Distancia</p>
                        <p className="font-semibold text-gray-800">{formatDistance(details.totalDistanceMeters)}</p>
                    </div>
                )}
                {details.averagePaceSecondsPerKm && (
                    <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Ritmo medio</p>
                        <p className="font-semibold text-gray-800">{formatPace(details.averagePaceSecondsPerKm)}</p>
                    </div>
                )}
                {details.averageHr && (
                    <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-gray-500">FC Media</p>
                        <p className="font-semibold text-gray-800">{details.averageHr} bpm</p>
                    </div>
                )}
            </div>

            {/* Zapatillas */}
            {details.shoe && (
                <div className="flex items-center text-sm text-gray-600">
                    <Footprints className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{details.shoe.nickname || `${details.shoe.brand} ${details.shoe.model}`}</span>
                </div>
            )}

            {/* Notas */}
            {details.notes && (
                <p className="text-sm text-gray-600 italic">"{details.notes}"</p>
            )}

            {/* Intervalos */}
            {details.intervals.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                        {details.intervals.length === 1 ? 'Resumen' : `Intervalos (${details.intervals.length})`}
                    </p>
                    <div className="space-y-2">
                        {details.intervals.map((interval, index) => (
                            <div key={interval.id} className="bg-white p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-xs font-medium text-gray-400 w-6">{index + 1}</span>
                                    <span className="text-sm font-medium text-green-600 mr-3">
                                        {runIntervalTypeLabels[interval.type]}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span>{formatDuration(interval.durationSeconds)}</span>
                                    {interval.distanceMeters && (
                                        <span>{formatDistance(interval.distanceMeters)}</span>
                                    )}
                                    {interval.paceSecondsPerKm && (
                                        <span className="text-gray-400">{formatPace(interval.paceSecondsPerKm)}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default WorkoutCard