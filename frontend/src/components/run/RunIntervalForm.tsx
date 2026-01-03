import { Trash2, GripVertical } from 'lucide-react'
import type { RunIntervalType } from '../../types/run'
import { runIntervalTypeLabels } from '../../types/run'
import DurationInput from '../ui/DurationInput'

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
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <GripVertical className="w-5 h-5 text-gray-300 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Intervalo {index + 1}</span>
                </div>
                {canRemove && (
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Tipo y Duración */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Tipo</label>
                    <select
                        value={interval.type}
                        onChange={(e) => updateField('type', e.target.value as RunIntervalType)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                    >
                        {intervalTypes.map(t => (
                            <option key={t} value={t}>{runIntervalTypeLabels[t]}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Duración *</label>
                    <DurationInput
                        value={interval.durationSeconds}
                        onChange={(secs) => updateField('durationSeconds', secs)}
                    />
                </div>
            </div>

            {/* Distancia y FC */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Distancia (m)</label>
                    <input
                        type="number"
                        value={interval.distanceMeters ?? ''}
                        onChange={(e) => updateField('distanceMeters', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="1000"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">FC Media</label>
                    <input
                        type="number"
                        value={interval.averageHr ?? ''}
                        onChange={(e) => updateField('averageHr', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="150"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                </div>
            </div>

            {/* Cadencia y Desnivel */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Cadencia (spm)</label>
                    <input
                        type="number"
                        value={interval.cadenceSpm ?? ''}
                        onChange={(e) => updateField('cadenceSpm', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="180"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Desnivel (m)</label>
                    <input
                        type="number"
                        value={interval.elevationGain ?? ''}
                        onChange={(e) => updateField('elevationGain', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="50"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                </div>
            </div>
        </div>
    )
}

export default RunIntervalForm
export type { IntervalFormData }