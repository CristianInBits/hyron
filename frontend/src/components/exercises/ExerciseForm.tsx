import { useState, useEffect } from 'react'
import type { ExerciseResponse, ExerciseCreateRequest, MuscleGroup } from '../../types/exercise'
import { muscleGroupLabels } from '../../types/exercise'
import { getErrorMessage } from '../../services/errorHandler'
import { Input, Label, Select } from '../ui'

type ExerciseFormProps = {
    exercise?: ExerciseResponse | null
    onSubmit: (data: ExerciseCreateRequest) => Promise<void>
    onCancel: () => void
}

const muscleGroups: MuscleGroup[] = [
    'CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'ABS', 'CARDIO', 'FULL_BODY', 'OTHER'
]

function ExerciseForm({ exercise, onSubmit, onCancel }: ExerciseFormProps) {
    const [name, setName] = useState('')
    const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('CHEST')
    const [notes, setNotes] = useState('')
    const [isUnilateral, setIsUnilateral] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (exercise) {
            setName(exercise.name)
            setMuscleGroup(exercise.muscleGroup)
            setNotes(exercise.notes || '')
            setIsUnilateral(exercise.isUnilateral)
        } else {
            setName('')
            setMuscleGroup('CHEST')
            setNotes('')
            setIsUnilateral(false)
        }
    }, [exercise])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            setError('El nombre es obligatorio')
            return
        }

        try {
            setLoading(true)
            setError(null)
            await onSubmit({
                name: name.trim(),
                muscleGroup,
                notes: notes.trim() || null,
                isUnilateral,
            })
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Nombre */}
            <div className="mb-4">
                <Label>Nombre *</Label>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Press de banca"
                    variant="purple"
                />
            </div>

            {/* Grupo muscular */}
            <div className="mb-4">
                <Label>Grupo muscular *</Label>
                <Select
                    value={muscleGroup}
                    onChange={(e) => setMuscleGroup(e.target.value as MuscleGroup)}
                    variant="purple"
                >
                    {muscleGroups.map(mg => (
                        <option key={mg} value={mg}>
                            {muscleGroupLabels[mg]}
                        </option>
                    ))}
                </Select>
            </div>

            {/* Notas */}
            <div className="mb-4">
                <Label>Notas (opcional)</Label>
                <Input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Posición del asiento, agarre, etc."
                    variant="purple"
                />
            </div>

            {/* Unilateral */}
            <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isUnilateral}
                        onChange={(e) => setIsUnilateral(e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-400"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ejercicio unilateral</span>
                </label>
                <p className="text-xs text-gray-400 mt-1 ml-6">
                    Marca si se realiza un lado a la vez (ej: curl a una mano)
                </p>
            </div>

            {/* Botones */}
            <div className="flex space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    )
}

export default ExerciseForm