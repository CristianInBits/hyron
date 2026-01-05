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

    const labelCls = 'block text-xs font-medium text-gray-500 mb-1'
    const controlCls =
        'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white ' +
        'focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400'

    const compactControlCls =
        'px-2 py-2 text-sm border border-gray-200 rounded-lg bg-white ' +
        'focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400'

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
                    <label className={labelCls}>Tipo</label>
                    <select
                        value={interval.type}
                        onChange={(e) => updateField('type', e.target.value as RunIntervalType)}
                        className={controlCls}
                    >
                        {intervalTypes.map((t) => (
                            <option key={t} value={t}>
                                {runIntervalTypeLabels[t]}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className={labelCls}>Duración *</label>
                    {/* Ideal: que DurationInput acepte className para aplicar el mismo controlCls */}
                    <DurationInput
                        value={interval.durationSeconds}
                        onChange={(secs) => updateField('durationSeconds', secs)}
                        inputClassName={compactControlCls}
                    />
                </div>
            </div>

            {/* Distancia y FC */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className={labelCls}>Distancia (m)</label>
                    <input
                        type="number"
                        value={interval.distanceMeters ?? ''}
                        onChange={(e) => updateField('distanceMeters', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="1000"
                        className={controlCls}
                    />
                </div>

                <div>
                    <label className={labelCls}>FC Media</label>
                    <input
                        type="number"
                        value={interval.averageHr ?? ''}
                        onChange={(e) => updateField('averageHr', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="150"
                        className={controlCls}
                    />
                </div>
            </div>

            {/* Cadencia y Desnivel */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>Cadencia (spm)</label>
                    <input
                        type="number"
                        value={interval.cadenceSpm ?? ''}
                        onChange={(e) => updateField('cadenceSpm', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="180"
                        className={controlCls}
                    />
                </div>

                <div>
                    <label className={labelCls}>Desnivel (m)</label>
                    <input
                        type="number"
                        value={interval.elevationGain ?? ''}
                        onChange={(e) => updateField('elevationGain', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="50"
                        className={controlCls}
                    />
                </div>
            </div>
        </div>
    )
}

export default RunIntervalForm
export type { IntervalFormData }
