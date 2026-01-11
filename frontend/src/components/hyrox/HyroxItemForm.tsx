import { Trash2 } from 'lucide-react'
import type { HyroxStation } from '../../types/hyrox'
import {
    hyroxStationLabels,
    hyroxStationIcons,
    requiresDistance,
    requiresWeight,
    requiresReps
} from '../../types/hyrox'
import { Input, Label, Select, DurationInput } from '../ui'

export type ItemFormData = {
    station: HyroxStation
    durationSeconds: number
    recoveryDurationSeconds: number | null
    distanceMeters: number | null
    reps: number | null
    weightKg: number | null
    averageHr: number | null
    rpe: number | null
    notes: string
}

type HyroxItemFormProps = {
    index: number
    item: ItemFormData
    onChange: (index: number, item: ItemFormData) => void
    onRemove: (index: number) => void
    canRemove: boolean
}

const stations: HyroxStation[] = [
    'RUN', 'SKI_ERG', 'SLED_PUSH', 'SLED_PULL', 'BURPEE_BROAD_JUMP',
    'ROW', 'FARMERS_CARRY', 'SANDBAG_LUNGES', 'WALL_BALLS', 'OTHER'
]

function HyroxItemForm({ index, item, onChange, onRemove, canRemove }: HyroxItemFormProps) {
    const updateField = <K extends keyof ItemFormData>(field: K, value: ItemFormData[K]) => {
        onChange(index, { ...item, [field]: value })
    }

    const needsDistance = requiresDistance(item.station)
    const needsWeight = requiresWeight(item.station)
    const needsReps = requiresReps(item.station)

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            {/* Cabecera */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <span className="text-lg mr-2">{hyroxStationIcons[item.station]}</span>
                    <span className="text-sm font-semibold text-gray-700">Estación {index + 1}</span>
                </div>
                {canRemove && (
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Tipo de estación */}
            <div className="mb-3">
                <Label>Estación</Label>
                <Select
                    value={item.station}
                    onChange={(e) => updateField('station', e.target.value as HyroxStation)}
                    variant="orange"
                >
                    {stations.map(s => (
                        <option key={s} value={s}>
                            {hyroxStationIcons[s]} {hyroxStationLabels[s]}
                        </option>
                    ))}
                </Select>
            </div>

            {/* Duración */}
            <div className="mb-3">
                <Label>Duración *</Label>
                <DurationInput
                    value={item.durationSeconds}
                    onChange={(secs) => updateField('durationSeconds', secs)}
                    variant="orange"
                />
            </div>

            {/* Campos condicionales */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Distancia */}
                {needsDistance && (
                    <div>
                        <Label>Distancia (m) *</Label>
                        <Input
                            type="number"
                            value={item.distanceMeters ?? ''}
                            onChange={(e) => updateField('distanceMeters', e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="1000"
                            variant="orange"
                        />
                    </div>
                )}

                {/* Peso */}
                {needsWeight && (
                    <div>
                        <Label>Peso (kg) *</Label>
                        <Input
                            type="number"
                            step="0.5"
                            value={item.weightKg ?? ''}
                            onChange={(e) => updateField('weightKg', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="20"
                            variant="orange"
                        />
                    </div>
                )}

                {/* Reps */}
                {needsReps && (
                    <div>
                        <Label>Repeticiones *</Label>
                        <Input
                            type="number"
                            value={item.reps ?? ''}
                            onChange={(e) => updateField('reps', e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="100"
                            variant="orange"
                        />
                    </div>
                )}

                {/* FC Media */}
                <div>
                    <Label>FC Media</Label>
                    <Input
                        type="number"
                        value={item.averageHr ?? ''}
                        onChange={(e) => updateField('averageHr', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="165"
                        variant="orange"
                    />
                </div>

                {/* RPE */}
                <div>
                    <Label>RPE (1-10)</Label>
                    <Input
                        type="number"
                        min="1"
                        max="10"
                        value={item.rpe ?? ''}
                        onChange={(e) => updateField('rpe', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="8"
                        variant="orange"
                    />
                </div>
            </div>

            {/* Recuperación */}
            <div>
                <Label>Recuperación después</Label>
                <DurationInput
                    value={item.recoveryDurationSeconds ?? 0}
                    onChange={(secs) => updateField('recoveryDurationSeconds', secs || null)}
                    variant="orange"
                />
            </div>
        </div>
    )
}

export default HyroxItemForm