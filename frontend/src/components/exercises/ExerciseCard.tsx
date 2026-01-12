import { Dumbbell, Pencil, Trash2, Power } from 'lucide-react'
import type { ExerciseResponse } from '../../types/exercise'
import { muscleGroupLabels } from '../../types/exercise'

type ExerciseCardProps = {
    exercise: ExerciseResponse
    onEdit: (exercise: ExerciseResponse) => void
    onDelete: (id: number) => void
    onToggleActive: (exercise: ExerciseResponse) => void
}

function ExerciseCard({ exercise, onEdit, onDelete, onToggleActive }: ExerciseCardProps) {
    return (
        <div className={`bg-white p-4 rounded-xl shadow-sm transition-all 
            ${!exercise.active
                ? 'opacity-60 bg-gray-50 hover:opacity-80 hover:shadow hover:bg-gray-100/60'
                : 'border-l-4 border-purple-500 hover:-translate-y-0.5 hover:shadow-md hover:bg-purple-50/30'
            }`}>
            <div className="flex items-start justify-between">
                {/* Info principal */}
                <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${exercise.active ? 'bg-purple-50' : 'bg-gray-200'
                        }`}>
                        <Dumbbell className={`w-6 h-6 ${exercise.active ? 'text-purple-500' : 'text-gray-400'
                            }`} />
                    </div>
                    <div>
                        <div className="flex items-center flex-wrap gap-2">
                            <p className="font-medium text-gray-800">{exercise.name}</p>
                            {exercise.isUnilateral && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                                    Unilateral
                                </span>
                            )}
                            {!exercise.active && (
                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                    Inactivo
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-purple-600 mt-0.5">
                            {muscleGroupLabels[exercise.muscleGroup]}
                        </p>
                        {exercise.notes && (
                            <p className="text-sm text-gray-400 mt-1">{exercise.notes}</p>
                        )}
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex space-x-1">
                    <button
                        className={`p-2 rounded-lg transition-colors ${exercise.active
                                ? 'text-green-500 hover:text-green-700 hover:bg-green-50'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                        onClick={() => onToggleActive(exercise)}
                        title={exercise.active ? 'Desactivar ejercicio' : 'Reactivar ejercicio'}
                    >
                        <Power className="w-5 h-5" />
                    </button>
                    <button
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => onEdit(exercise)}
                        title="Editar"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => onDelete(exercise.id)}
                        title="Eliminar"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ExerciseCard