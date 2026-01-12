import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { GymSetType } from '../../types/gym'
import { gymSetTypeLabels } from '../../types/gym'
import { Input, Select } from '../ui'

export type SetFormData = {
    type: GymSetType
    weightKg: number | null
    reps: number | null
    executionSeconds: number | null
    rpe: number | null
    restSeconds: number | null
}

type GymSetFormProps = {
    index: number
    set: SetFormData
    onChange: (index: number, set: SetFormData) => void
    onRemove: (index: number) => void
    canRemove: boolean
}

const setTypes: GymSetType[] = ['WARMUP', 'WORK', 'FAILURE', 'DROP_SET', 'MYO_REP']

function GymSetForm({ index, set, onChange, onRemove, canRemove }: GymSetFormProps) {
    const [showAdvanced, setShowAdvanced] = useState(
        set.executionSeconds !== null || set.restSeconds !== null
    )

    const updateField = <K extends keyof SetFormData>(field: K, value: SetFormData[K]) => {
        onChange(index, { ...set, [field]: value })
    }

    return (
        <div className="py-2 border-b border-gray-100 last:border-0">
            {/* Fila principal */}
            <div className="flex items-center space-x-2">
                {/* Número de serie */}
                <span className="text-xs font-medium text-gray-400 w-6">{index + 1}</span>

                {/* Tipo */}
                <Select
                    value={set.type}
                    onChange={(e) => updateField('type', e.target.value as GymSetType)}
                    variant="purple"
                    className="w-24 px-2 py-1 text-xs"
                >
                    {setTypes.map(t => (
                        <option key={t} value={t}>{gymSetTypeLabels[t]}</option>
                    ))}
                </Select>

                {/* Peso */}
                <div className="flex items-center">
                    <Input
                        type="number"
                        step="0.5"
                        value={set.weightKg ?? ''}
                        onChange={(e) => updateField('weightKg', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="0"
                        variant="purple"
                        className="w-14 px-2 py-1 text-sm text-center"
                    />
                    <span className="text-xs text-gray-400 ml-1">kg</span>
                </div>

                {/* Reps */}
                <div className="flex items-center">
                    <Input
                        type="number"
                        value={set.reps ?? ''}
                        onChange={(e) => updateField('reps', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="0"
                        variant="purple"
                        className="w-12 px-2 py-1 text-sm text-center"
                    />
                    <span className="text-xs text-gray-400 ml-1">reps</span>
                </div>

                {/* RPE */}
                <div className="flex items-center">
                    <Input
                        type="number"
                        step="0.5"
                        min="0"
                        max="10"
                        value={set.rpe ?? ''}
                        onChange={(e) => updateField('rpe', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="-"
                        variant="purple"
                        className="w-10 px-1 py-1 text-sm text-center"
                    />
                    <span className="text-xs text-gray-400 ml-1">RPE</span>
                </div>

                {/* Toggle avanzado */}
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                >
                    {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Eliminar */}
                {canRemove && (
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="p-1 text-red-400 hover:text-red-600"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Fila avanzada */}
            {showAdvanced && (
                <div className="flex items-center space-x-3 mt-2 ml-6 pl-1">
                    {/* Tiempo de ejecución */}
                    <div className="flex items-center">
                        <Input
                            type="number"
                            value={set.executionSeconds ?? ''}
                            onChange={(e) => updateField('executionSeconds', e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="0"
                            variant="purple"
                            className="w-14 px-2 py-1 text-sm text-center"
                        />
                        <span className="text-xs text-gray-400 ml-1">seg ejecución</span>
                    </div>

                    {/* Descanso */}
                    <div className="flex items-center">
                        <Input
                            type="number"
                            value={set.restSeconds ?? ''}
                            onChange={(e) => updateField('restSeconds', e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="0"
                            variant="purple"
                            className="w-14 px-2 py-1 text-sm text-center"
                        />
                        <span className="text-xs text-gray-400 ml-1">seg descanso</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GymSetForm