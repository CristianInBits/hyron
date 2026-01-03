import { Trash2, GripVertical } from 'lucide-react'
import type { RunIntervalType } from '../../types/run'
import { runIntervalTypeLabels } from '../../types/run'

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

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const parseDuration = (value: string): number => {
        const parts = value.split(':')
        if (parts.length === 2) {
            const mins = parseInt(parts[0]) || 0
            const secs = parseInt(parts[1]) || 0
            return mins * 60 + secs
        }
        return parseInt(value) || 0
    }

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200" >
            <div className="flex items-center justify-between mb-3" >
                <div className="flex items-center" >
                    <GripVertical className="w-5 h-5 text-gray-300 mr-2" />
                    <span className="text-sm font-medium text-gray-600" > Intervalo {index + 1} </span>
                </div>
                {
                    canRemove && (
                        <button
                            type="button"
                            onClick={() => onRemove(index)
                            }
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )
                }
            </div>

            < div className="grid grid-cols-2 gap-3" >
                {/* Tipo */}
                < div >
                    <label className="block text-xs text-gray-500 mb-1" > Tipo </label>
                    < select
                        value={interval.type}
                        onChange={(e) => updateField('type', e.target.value as RunIntervalType)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                    >
                        {
                            intervalTypes.map(t => (
                                <option key={t} value={t} > {runIntervalTypeLabels[t]} </option>
                            ))
                        }
                    </select>
                </div>

                {/* Duración */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1" > Duración(mm: ss) * </label>
                    < input
                        type="text"
                        value={formatDuration(interval.durationSeconds)}
                        onChange={(e) => updateField('durationSeconds', parseDuration(e.target.value))}
                        placeholder="5:00"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                </div>

                {/* Distancia */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1" > Distancia(m) </label>
                    < input
                        type="number"
                        value={interval.distanceMeters ?? ''}
                        onChange={(e) => updateField('distanceMeters', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="1000"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                </div>

                {/* FC Media */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1" > FC Media </label>
                    < input
                        type="number"
                        value={interval.averageHr ?? ''}
                        onChange={(e) => updateField('averageHr', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="150"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                </div>

                {/* Cadencia */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1" > Cadencia(spm) </label>
                    < input
                        type="number"
                        value={interval.cadenceSpm ?? ''}
                        onChange={(e) => updateField('cadenceSpm', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="180"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                </div>

                {/* Desnivel */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1" > Desnivel(m) </label>
                    < input
                        type="number"
                        value={interval.elevationGain ?? ''}
                        onChange={(e) => updateField('elevationGain', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="50"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                </div>
            </div>

            {/* Notas */}
            <div className="mt-3" >
                <label className="block text-xs text-gray-500 mb-1" > Notas </label>
                < input
                    type="text"
                    value={interval.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Notas del intervalo..."
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                />
            </div>
        </div>
    )
}

export default RunIntervalForm
export type { IntervalFormData }