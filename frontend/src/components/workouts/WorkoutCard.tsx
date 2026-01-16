import { Dog, Fish, Dumbbell, Flame, Trash2, ChevronDown, ChevronUp, Footprints, Pencil } from 'lucide-react'
import type { WorkoutSummaryResponse } from '../../types/workout'
import type { RunDetailsResponse } from '../../types/run'
import { runIntervalTypeLabels } from '../../types/run'
import type { SwimDetailsResponse } from '../../types/swim'
import { swimIntervalTypeLabels, swimStrokeLabels, poolTypeLabels, swimEquipmentLabels } from '../../types/swim'
import type { GymDetailsResponse } from '../../types/gym'
import { gymSetTypeLabels } from '../../types/gym'
import { muscleGroupLabels } from '../../types/exercise'
import type { HyroxDetailsResponse } from '../../types/hyrox'
import { hyroxStationLabels, hyroxStationIcons } from '../../types/hyrox'
import { useSettings } from '../../context/SettingsContext'

type WorkoutCardProps = {
    workout: WorkoutSummaryResponse
    isExpanded: boolean
    details: RunDetailsResponse | SwimDetailsResponse | GymDetailsResponse | HyroxDetailsResponse | null
    loadingDetails: boolean
    onToggleExpand: (workout: WorkoutSummaryResponse) => void
    onDelete: (id: number) => void
    onEdit: (workout: WorkoutSummaryResponse) => void
    showActions?: boolean
}

const workoutConfig = {
    RUN: { icon: Dog, color: 'text-green-500', bg: 'bg-green-100', border: 'border-green-200', label: 'Run' },
    SWIM: { icon: Fish, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200', label: 'Swim' },
    GYM: { icon: Dumbbell, color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-200', label: 'Gym' },
    HYROX: { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-200', label: 'Hyrox' },
}

function WorkoutCard({ workout, isExpanded, details, loadingDetails, onToggleExpand, onDelete, onEdit, showActions = true }: WorkoutCardProps) {
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md overflow-hidden">
            {/* Cabecera clickeable */}
            <div
                className="p-4 flex items-center cursor-pointer transition-colors hover:bg-gray-50"
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
                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">
                            RPE {workout.globalRpe}
                        </span>
                    </div>
                )}

                {/* Acciones + Chevron */}
                <div className="flex items-center space-x-1">
                    {showActions && (
                        <>
                            <button
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit(workout)
                                }}
                                title="Editar"
                            >
                                <Pencil className="w-5 h-5" />
                            </button>

                            <button
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete(workout.id)
                                }}
                                title="Eliminar"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 ml-1" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 ml-1" />
                    )}
                </div>
            </div>

            {/* Detalles expandidos */}
            {isExpanded && (
                <div className={`border-t ${config.border} p-4 ${config.bg}`}>
                    {loadingDetails && <p className="text-sm text-gray-500">Cargando detalles...</p>}
                    {!loadingDetails && !details && <p className="text-sm text-gray-500">No hay detalles disponibles</p>}
                    {!loadingDetails && details && workout.type === 'RUN' && <RunDetails details={details as RunDetailsResponse} />}
                    {!loadingDetails && details && workout.type === 'SWIM' && <SwimDetails details={details as SwimDetailsResponse} />}
                    {!loadingDetails && details && workout.type === 'GYM' && <GymDetails details={details as GymDetailsResponse} />}
                    {!loadingDetails && details && workout.type === 'HYROX' && <HyroxDetails details={details as HyroxDetailsResponse} />}
                </div>
            )}
        </div>
    )
}

function RunDetails({ details }: { details: RunDetailsResponse }) {
    const { formatDistance, formatPace } = useSettings()

    const formatDuration = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="space-y-4">
            {/* Resumen */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {details.totalDurationSeconds && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500">Duración</p>
                        <p className="font-semibold text-gray-800">{formatDuration(details.totalDurationSeconds)}</p>
                    </div>
                )}
                {details.totalDistanceMeters && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500">Distancia</p>
                        <p className="font-semibold text-gray-800">{formatDistance(details.totalDistanceMeters)}</p>
                    </div>
                )}
                {details.averagePaceSecondsPerKm && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500">Ritmo medio</p>
                        <p className="font-semibold text-gray-800">{formatPace(details.averagePaceSecondsPerKm)}</p>
                    </div>
                )}
                {details.averageHr && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500">FC Media</p>
                        <p className="font-semibold text-gray-800">{details.averageHr} bpm</p>
                    </div>
                )}
            </div>

            {/* Zapatillas */}
            {details.shoe && (
                <div className="flex items-center text-sm text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <Footprints className="w-4 h-4 mr-2 text-green-500" />
                    <span>{details.shoe.nickname || `${details.shoe.brand} ${details.shoe.model}`}</span>
                </div>
            )}

            {/* Notas */}
            {details.notes && (
                <p className="text-sm text-gray-600 italic bg-white px-3 py-2 rounded-lg shadow-sm">"{details.notes}"</p>
            )}

            {/* Intervalos */}
            {details.intervals.length > 1 && (
                <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                        Intervalos ({details.intervals.length})
                    </p>
                    <div className="space-y-2">
                        {details.intervals.map((interval, index) => (
                            <div key={interval.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
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

function SwimDetails({ details }: { details: SwimDetailsResponse }) {
    const { formatDistance, formatSwimPace } = useSettings()

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const formatSwimDistance = (meters: number | null) => {
        if (meters === null) return '-'
        return `${meters} m`
    }

    return (
        <div className="space-y-4">
            {/* Resumen */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {details.totalTimeSeconds && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500">Duración</p>
                        <p className="font-semibold text-gray-800">{formatDuration(details.totalTimeSeconds)}</p>
                    </div>
                )}
                {details.totalDistanceMeters && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500">Distancia</p>
                        <p className="font-semibold text-gray-800">{formatSwimDistance(details.totalDistanceMeters)}</p>
                    </div>
                )}
                {details.averagePaceSecondsPer100m && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500">Ritmo medio</p>
                        <p className="font-semibold text-gray-800">{formatSwimPace(details.averagePaceSecondsPer100m)}</p>
                    </div>
                )}
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500">Piscina</p>
                    <p className="font-semibold text-gray-800">{poolTypeLabels[details.poolType]}</p>
                </div>
            </div>

            {/* Notas */}
            {details.notes && (
                <p className="text-sm text-gray-600 italic bg-white px-3 py-2 rounded-lg shadow-sm">"{details.notes}"</p>
            )}

            {/* Intervalos */}
            {details.intervals.length > 1 && (
                <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                        Intervalos ({details.intervals.length})
                    </p>
                    <div className="space-y-2">
                        {details.intervals.map((interval, index) => (
                            <div key={interval.id} className="bg-white p-3 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center">
                                        <span className="text-xs font-medium text-gray-400 w-6">{index + 1}</span>
                                        <span className="text-sm font-medium text-blue-600 mr-2">
                                            {swimIntervalTypeLabels[interval.type]}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {swimStrokeLabels[interval.stroke]}
                                        </span>
                                    </div>
                                    {interval.rpe && (
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                            RPE {interval.rpe}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    {interval.distanceMeters && (
                                        <span>{formatSwimDistance(interval.distanceMeters)}</span>
                                    )}
                                    {interval.durationSeconds && (
                                        <span>{formatDuration(interval.durationSeconds)}</span>
                                    )}
                                    {interval.paceSecondsPer100m && (
                                        <span className="text-gray-400">{formatSwimPace(interval.paceSecondsPer100m)}</span>
                                    )}
                                    {interval.restSeconds && (
                                        <span className="text-gray-400">🔄 {formatDuration(interval.restSeconds)}</span>
                                    )}
                                </div>
                                {interval.equipment.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {interval.equipment.map(eq => (
                                            <span key={eq} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                                {swimEquipmentLabels[eq]}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function GymDetails({ details }: { details: GymDetailsResponse }) {
    const { formatWeight } = useSettings()

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getSupersetLabels = (): Map<string, string> => {
        const labels = new Map<string, string>()
        const supersetIds = [...new Set(details.exercises.filter(ex => ex.supersetId).map(ex => ex.supersetId!))]
        supersetIds.forEach((id, index) => {
            labels.set(id, String.fromCharCode(65 + index))
        })
        return labels
    }

    const supersetLabels = getSupersetLabels()

    return (
        <div className="space-y-4">
            {/* Resumen */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500">Ejercicios</p>
                    <p className="font-semibold text-gray-800">{details.exercises.length}</p>
                </div>
                {details.totalDurationSeconds && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500">Duración</p>
                        <p className="font-semibold text-gray-800">{formatDuration(details.totalDurationSeconds)}</p>
                    </div>
                )}
                {details.totalVolumeKg && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500">Volumen</p>
                        <p className="font-semibold text-gray-800">{formatWeight(details.totalVolumeKg, 0)}</p>
                    </div>
                )}
            </div>

            {/* Notas */}
            {details.notes && (
                <p className="text-sm text-gray-600 italic bg-white px-3 py-2 rounded-lg shadow-sm">"{details.notes}"</p>
            )}

            {/* Ejercicios */}
            {details.exercises.length > 0 && (
                <div className="space-y-3">
                    {details.exercises.map((exercise) => {
                        const supersetLabel = exercise.supersetId ? supersetLabels.get(exercise.supersetId) : null

                        return (
                            <div
                                key={exercise.id}
                                className={`bg-white p-3 rounded-lg shadow-sm ${supersetLabel ? 'border-l-4 border-purple-400' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        {supersetLabel && (
                                            <span className="text-xs font-bold text-white bg-purple-500 px-1.5 py-0.5 rounded mr-2">
                                                {supersetLabel}
                                            </span>
                                        )}
                                        <span className="font-medium text-gray-800">{exercise.exerciseName}</span>
                                        {exercise.isUnilateral && (
                                            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">U</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-purple-600">{muscleGroupLabels[exercise.muscleGroup]}</span>
                                </div>

                                <div className="space-y-1">
                                    {exercise.sets.map((set, setIndex) => (
                                        <div key={set.id} className="flex items-center text-sm text-gray-600">
                                            <span className="w-6 text-xs text-gray-400">{setIndex + 1}</span>
                                            <span className="w-20 text-xs text-purple-500">{gymSetTypeLabels[set.type]}</span>
                                            {set.weightKg !== null && (
                                                <span className="w-16">{formatWeight(set.weightKg, 1)}</span>
                                            )}
                                            {set.reps !== null && (
                                                <span className="w-12">×{set.reps}</span>
                                            )}
                                            {set.executionSeconds !== null && (
                                                <span className="w-14 text-xs text-gray-400">{set.executionSeconds}s</span>
                                            )}
                                            {set.rpe !== null && (
                                                <span className="text-xs text-gray-400 mr-2">@{set.rpe}</span>
                                            )}
                                            {set.restSeconds !== null && (
                                                <span className="text-xs text-blue-400">🔄{set.restSeconds}s</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {exercise.notes && (
                                    <p className="text-xs text-gray-400 mt-2 italic">{exercise.notes}</p>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function HyroxDetails({ details }: { details: HyroxDetailsResponse }) {
    const { formatDistance, formatPace, formatWeight } = useSettings()

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const totalTime = details.blocks.reduce((sum, block) => {
        const blockTime = block.items.reduce((s, item) => {
            return s + item.durationSeconds + (item.recoveryDurationSeconds ?? 0)
        }, 0)
        return sum + blockTime + (block.restDurationSeconds ?? 0)
    }, 0)

    const totalDistance = details.blocks.reduce((sum, block) => {
        return sum + block.items.reduce((s, item) => s + (item.distanceMeters ?? 0), 0)
    }, 0)

    return (
        <div className="space-y-4">
            {/* Resumen */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500">Rondas</p>
                    <p className="font-semibold text-gray-800">{details.blocks.length}</p>
                </div>
                {totalTime > 0 && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500">Tiempo total</p>
                        <p className="font-semibold text-gray-800">{formatDuration(totalTime)}</p>
                    </div>
                )}
                {totalDistance > 0 && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500">Distancia</p>
                        <p className="font-semibold text-gray-800">{formatDistance(totalDistance, 1)}</p>
                    </div>
                )}
            </div>

            {/* Zapatilla */}
            {details.shoe && (
                <div className="flex items-center text-sm text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <Footprints className="w-4 h-4 mr-2 text-orange-500" />
                    <span>{details.shoe.nickname || `${details.shoe.brand} ${details.shoe.model}`}</span>
                </div>
            )}

            {/* Notas */}
            {details.notes && (
                <p className="text-sm text-gray-600 italic bg-white px-3 py-2 rounded-lg shadow-sm">"{details.notes}"</p>
            )}

            {/* Rondas */}
            {details.blocks.length > 0 && (
                <div className="space-y-3">
                    {details.blocks.map((block) => (
                        <div key={block.id} className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-orange-600">Ronda {block.orderIndex}</span>
                                {block.restDurationSeconds && (
                                    <span className="text-xs text-gray-400">
                                        🔄 {formatDuration(block.restDurationSeconds)} descanso
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                {block.items.map((item) => (
                                    <div key={item.id} className="flex items-center text-sm">
                                        <span className="w-6 text-center">{hyroxStationIcons[item.station]}</span>
                                        <span className="w-28 text-gray-700">{hyroxStationLabels[item.station]}</span>
                                        <span className="w-16 text-gray-600">{formatDuration(item.durationSeconds)}</span>
                                        {item.distanceMeters && (
                                            <span className="w-20 text-gray-500">{formatDistance(item.distanceMeters, 0)}</span>
                                        )}
                                        {item.paceSecondsPerKm && (
                                            <span className="text-xs text-gray-400">{formatPace(item.paceSecondsPerKm)}</span>
                                        )}
                                        {item.weightKg && (
                                            <span className="text-xs text-gray-400 ml-2">{formatWeight(item.weightKg, 0)}</span>
                                        )}
                                        {item.reps && (
                                            <span className="text-xs text-gray-400 ml-2">×{item.reps}</span>
                                        )}
                                        {item.rpe && (
                                            <span className="text-xs text-orange-400 ml-2">@{item.rpe}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {block.notes && (
                                <p className="text-xs text-gray-400 mt-2 italic">{block.notes}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WorkoutCard