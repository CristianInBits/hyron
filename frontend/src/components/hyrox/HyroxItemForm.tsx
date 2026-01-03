import { Trash2 } from 'lucide-react'
import type { HyroxStation } from '../../types/hyrox'
import {
    hyroxStationLabels,
    hyroxStationIcons,
    requiresDistance,
    requiresWeight,
    requiresReps
} from '../../types/hyrox'
import DurationInput from '../ui/DurationInput'

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
        <div className="bg-white p-3 rounded-lg border border-gray-200">
            {/* Cabecera */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <span className="text-lg mr-2">{hyroxStationIcons[item.station]}</span>
                    <span className="text-sm font-medium text-gray-600">Estación {index + 1}</span>
                </div>
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

            {/* Tipo de estación */}
            <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">Estación</label>
                <select
                    value={item.station}
                    onChange={(e) => updateField('station', e.target.value as HyroxStation)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                    {stations.map(s => (
                        <option key={s} value={s}>
                            {hyroxStationIcons[s]} {hyroxStationLabels[s]}
                        </option>
                    ))}
                </select>
            </div>

            {/* Duración */}
            <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">Duración *</label>
                <DurationInput
                    value={item.durationSeconds}
                    onChange={(secs) => updateField('durationSeconds', secs)}
                />
            </div>

            {/* Campos condicionales */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Distancia */}
                {needsDistance && (
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Distancia (m) *</label>
                        <input
                            type="number"
                            value={item.distanceMeters ?? ''}
                            onChange={(e) => updateField('distanceMeters', e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="1000"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
                        />
                    </div>
                )}

                {/* Peso */}
                {needsWeight && (
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Peso (kg) *</label>
                        <input
                            type="number"
                            step="0.5"
                            value={item.weightKg ?? ''}
                            onChange={(e) => updateField('weightKg', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="20"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
                        />
                    </div>
                )}

                {/* Reps */}
                {needsReps && (
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Repeticiones *</label>
                        <input
                            type="number"
                            value={item.reps ?? ''}
                            onChange={(e) => updateField('reps', e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="100"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
                        />
                    </div>
                )}

                {/* FC Media */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">FC Media</label>
                    <input
                        type="number"
                        value={item.averageHr ?? ''}
                        onChange={(e) => updateField('averageHr', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="165"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                </div>

                {/* RPE */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">RPE (1-10)</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={item.rpe ?? ''}
                        onChange={(e) => updateField('rpe', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="8"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                </div>
            </div>

            {/* Recuperación */}
            <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">Recuperación después</label>
                <DurationInput
                    value={item.recoveryDurationSeconds ?? 0}
                    onChange={(secs) => updateField('recoveryDurationSeconds', secs || null)}
                />
            </div>
        </div>
    )
}

export default HyroxItemForm