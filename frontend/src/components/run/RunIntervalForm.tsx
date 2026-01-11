import { Trash2, GripVertical } from 'lucide-react'
import type { RunIntervalType } from '../../types/run'
import { runIntervalTypeLabels } from '../../types/run'
import DurationInput from '../ui/DurationInput'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { Select } from '../ui/Select'

type IntervalFormData = {
    type: RunIntervalType
    durationSeconds: number
    distanceMeters: number | null
    averageHr: number | null
    cadenceSpm: number | null
    elevationGain: number | null
    notes: string
}

type RunIntervalFormProps = {
    index: number
    interval: IntervalFormData
    onChange: (index: number, interval: IntervalFormData) => void
    onRemove: (index: number) => void
    canRemove: boolean
}

const intervalTypes: RunIntervalType[] = ['WARMUP', 'WORK', 'REST', 'COOLDOWN', 'OTHER']

function RunIntervalForm({ index, interval, onChange, onRemove, canRemove }: RunIntervalFormProps) {
    const updateField = <K extends keyof IntervalFormData>(field: K, value: IntervalFormData[K]) => {
        onChange(index, { ...interval, [field]: value })
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <GripVertical className="w-5 h-5 text-gray-300 mr-2" />
                    <span className="text-sm font-semibold text-gray-700">Intervalo {index + 1}</span>
                </div>

                {canRemove && (
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar intervalo"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Tipo y Duración */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <Label>Tipo</Label>
                    <Select
                        variant="green"
                        value={interval.type}
                        onChange={(e) => updateField('type', e.target.value as RunIntervalType)}
                    >
                        {intervalTypes.map((t) => (
                            <option key={t} value={t}>
                                {runIntervalTypeLabels[t]}
                            </option>
                        ))}
                    </Select>
                </div>

                <div>
                    <Label>Duración *</Label>
                    <DurationInput
                        variant="green"
                        value={interval.durationSeconds}
                        onChange={(secs) => updateField('durationSeconds', secs)}
                    />
                </div>
            </div>

            {/* Distancia y FC */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <Label>Distancia (m)</Label>
                    <Input
                        variant="green"
                        type="number"
                        value={interval.distanceMeters ?? ''}
                        onChange={(e) => updateField('distanceMeters', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="1000"
                    />
                </div>

                <div>
                    <Label>FC Media</Label>
                    <Input
                        variant="green"
                        type="number"
                        value={interval.averageHr ?? ''}
                        onChange={(e) => updateField('averageHr', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="150"
                    />
                </div>
            </div>

            {/* Cadencia y Desnivel */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label>Cadencia (spm)</Label>
                    <Input
                        variant="green"
                        type="number"
                        value={interval.cadenceSpm ?? ''}
                        onChange={(e) => updateField('cadenceSpm', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="180"
                    />
                </div>

                <div>
                    <Label>Desnivel (m)</Label>
                    <Input
                        variant="green"
                        type="number"
                        value={interval.elevationGain ?? ''}
                        onChange={(e) => updateField('elevationGain', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="50"
                    />
                </div>
            </div>
        </div>
    )
}

export default RunIntervalForm
export type { IntervalFormData }