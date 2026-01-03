import { useState } from 'react'
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import type { ExerciseSummaryResponse } from '../../types/exercise'
import { muscleGroupLabels } from '../../types/exercise'
import type { SetFormData } from './GymSetForm'
import GymSetForm from './GymSetForm'

export type ExerciseFormData = {
    exerciseId: number | null
    exerciseName: string
    notes: string
    sets: SetFormData[]
}

type GymExerciseFormProps = {
    index: number
    exercise: ExerciseFormData
    exercises: ExerciseSummaryResponse[]
    onChange: (index: number, exercise: ExerciseFormData) => void
    onRemove: (index: number) => void
    canRemove: boolean
}

const emptySet: SetFormData = {
    type: 'WORK',
    weightKg: null,
    reps: null,
    executionSeconds: null,
    rpe: null,
    restSeconds: null,
}

function GymExerciseForm({ index, exercise, exercises, onChange, onRemove, canRemove }: GymExerciseFormProps) {
    const [isExpanded, setIsExpanded] = useState(true)

    const updateField = <K extends keyof ExerciseFormData>(field: K, value: ExerciseFormData[K]) => {
        onChange(index, { ...exercise, [field]: value })
    }

    const handleExerciseSelect = (exerciseId: number) => {
        const selected = exercises.find(e => e.id === exerciseId)
        onChange(index, {
            ...exercise,
            exerciseId,
            exerciseName: selected?.name ?? '',
        })
    }

    const handleAddSet = () => {
        updateField('sets', [...exercise.sets, { ...emptySet }])
    }

    const handleUpdateSet = (setIndex: number, set: SetFormData) => {
        const updated = [...exercise.sets]
        updated[setIndex] = set
        updateField('sets', updated)
    }

    const handleRemoveSet = (setIndex: number) => {
        updateField('sets', exercise.sets.filter((_, i) => i !== setIndex))
    }

    // Agrupar ejercicios por grupo muscular
    const groupedExercises = exercises.reduce((acc, ex) => {
        if (!acc[ex.muscleGroup]) {
            acc[ex.muscleGroup] = []
        }
        acc[ex.muscleGroup].push(ex)
        return acc
    }, {} as Record<string, ExerciseSummaryResponse[]>)

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Cabecera del ejercicio */}
            <div
                className="flex items-center justify-between p-3 bg-purple-50 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center flex-1 min-w-0">
                    <span className="text-sm font-bold text-purple-600 mr-3">{index + 1}</span>
                    {exercise.exerciseId ? (
                        <span className="font-medium text-gray-800 truncate">{exercise.exerciseName}</span>
                    ) : (
                        <span className="text-gray-400 italic">Selecciona ejercicio</span>
                    )}
                    <span className="ml-2 text-xs text-gray-400">
                        ({exercise.sets.length} {exercise.sets.length === 1 ? 'serie' : 'series'})
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    {canRemove && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                onRemove(index)
                            }}
                            className="p-1 text-red-400 hover:text-red-600"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            </div>

            {/* Contenido expandido */}
            {isExpanded && (
                <div className="p-3">
                    {/* Selector de ejercicio */}
                    <div className="mb-3">
                        <label className="block text-xs text-gray-500 mb-1">Ejercicio</label>
                        <select
                            value={exercise.exerciseId ?? ''}
                            onChange={(e) => handleExerciseSelect(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="">Selecciona ejercicio...</option>
                            {Object.entries(groupedExercises).map(([group, exs]) => (
                                <optgroup key={group} label={muscleGroupLabels[group as keyof typeof muscleGroupLabels]}>
                                    {exs.map(ex => (
                                        <option key={ex.id} value={ex.id}>
                                            {ex.name} {ex.isUnilateral ? '(U)' : ''}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Series */}
                    <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-gray-500">Series</label>
                            <button
                                type="button"
                                onClick={handleAddSet}
                                className="flex items-center text-purple-600 hover:text-purple-700 text-xs"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                Añadir serie
                            </button>
                        </div>

                        {/* Cabecera de columnas */}
                        <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1 px-1">
                            <span className="w-6">#</span>
                            <span className="w-24">Tipo</span>
                            <span className="w-20">Peso</span>
                            <span className="w-18">Reps</span>
                            <span className="w-16">RPE</span>
                        </div>

                        <div className="bg-gray-50 rounded-lg px-2">
                            {exercise.sets.map((set, setIndex) => (
                                <GymSetForm
                                    key={setIndex}
                                    index={setIndex}
                                    set={set}
                                    onChange={handleUpdateSet}
                                    onRemove={handleRemoveSet}
                                    canRemove={exercise.sets.length > 1}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Notas (opcional)</label>
                        <input
                            type="text"
                            value={exercise.notes}
                            onChange={(e) => updateField('notes', e.target.value)}
                            placeholder="Notas del ejercicio..."
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default GymExerciseForm