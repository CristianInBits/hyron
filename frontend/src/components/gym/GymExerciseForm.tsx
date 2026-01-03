import { useState } from 'react'
import { Trash2, Plus, ChevronDown, ChevronUp, Link, Unlink } from 'lucide-react'
import type { ExerciseSummaryResponse } from '../../types/exercise'
import { muscleGroupLabels } from '../../types/exercise'
import type { SetFormData } from './GymSetForm'
import GymSetForm from './GymSetForm'

export type ExerciseFormData = {
    exerciseId: number | null
    exerciseName: string
    supersetId: string | null
    notes: string
    sets: SetFormData[]
}

type GymExerciseFormProps = {
    index: number
    exercise: ExerciseFormData
    exercises: ExerciseSummaryResponse[]
    supersetGroups: Map<string, string> // supersetId -> label (A, B, C...)
    onChange: (index: number, exercise: ExerciseFormData) => void
    onRemove: (index: number) => void
    onCreateSuperset: (exerciseIndex: number) => void
    onJoinSuperset: (exerciseIndex: number, supersetId: string) => void
    onLeaveSuperset: (exerciseIndex: number) => void
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

function GymExerciseForm({
    index,
    exercise,
    exercises,
    supersetGroups,
    onChange,
    onRemove,
    onCreateSuperset,
    onJoinSuperset,
    onLeaveSuperset,
    canRemove
}: GymExerciseFormProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [showSupersetMenu, setShowSupersetMenu] = useState(false)

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

    // Obtener etiqueta de superserie (A, B, C...) y número dentro del grupo
    const getSupersetLabel = (): string | null => {
        if (!exercise.supersetId) return null
        return supersetGroups.get(exercise.supersetId) ?? null
    }

    const supersetLabel = getSupersetLabel()

    // Agrupar ejercicios por grupo muscular
    const groupedExercises = exercises.reduce((acc, ex) => {
        if (!acc[ex.muscleGroup]) {
            acc[ex.muscleGroup] = []
        }
        acc[ex.muscleGroup].push(ex)
        return acc
    }, {} as Record<string, ExerciseSummaryResponse[]>)

    // Obtener otras superseries disponibles para unirse
    const availableSupersets = Array.from(supersetGroups.entries())
        .filter(([id]) => id !== exercise.supersetId)

    return (
        <div className={`bg-white rounded-lg border-2 overflow-hidden ${supersetLabel
                ? 'border-purple-300 ring-2 ring-purple-100'
                : 'border-gray-200'
            }`}>
            {/* Cabecera del ejercicio */}
            <div
                className={`flex items-center justify-between p-3 cursor-pointer ${supersetLabel ? 'bg-purple-50' : 'bg-purple-50'
                    }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center flex-1 min-w-0">
                    {/* Etiqueta de superserie */}
                    {supersetLabel && (
                        <span className="text-xs font-bold text-white bg-purple-500 px-2 py-0.5 rounded mr-2">
                            {supersetLabel}
                        </span>
                    )}
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
                <div className="flex items-center space-x-1">
                    {/* Botón superserie */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowSupersetMenu(!showSupersetMenu)
                            }}
                            className={`p-1.5 rounded ${supersetLabel
                                    ? 'text-purple-600 hover:bg-purple-100'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                }`}
                            title="Superserie"
                        >
                            <Link className="w-4 h-4" />
                        </button>

                        {/* Menú de superserie */}
                        {showSupersetMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowSupersetMenu(false)
                                    }}
                                />
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    {!exercise.supersetId ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onCreateSuperset(index)
                                                    setShowSupersetMenu(false)
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-lg"
                                            >
                                                <Plus className="w-4 h-4 inline mr-2" />
                                                Nueva superserie
                                            </button>
                                            {availableSupersets.length > 0 && (
                                                <>
                                                    <div className="border-t border-gray-100" />
                                                    <p className="px-4 py-1 text-xs text-gray-400">Unirse a:</p>
                                                    {availableSupersets.map(([id, label]) => (
                                                        <button
                                                            key={id}
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                onJoinSuperset(index, id)
                                                                setShowSupersetMenu(false)
                                                            }}
                                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                                        >
                                                            <span className="inline-block w-6 text-center font-bold text-purple-600">{label}</span>
                                                            Superserie {label}
                                                        </button>
                                                    ))}
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onLeaveSuperset(index)
                                                setShowSupersetMenu(false)
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg text-red-600"
                                        >
                                            <Unlink className="w-4 h-4 inline mr-2" />
                                            Salir de superserie
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {canRemove && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                onRemove(index)
                            }}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                            <Trash2 className="w-4 h-4" />
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
                            <span className="w-16">Reps</span>
                            <span className="w-14">RPE</span>
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