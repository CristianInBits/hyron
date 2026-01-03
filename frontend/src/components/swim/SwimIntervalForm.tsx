import { Trash2, GripVertical } from 'lucide-react'
import type { SwimIntervalType, SwimStroke, SwimEquipment } from '../../types/swim'
import { swimIntervalTypeLabels, swimStrokeLabels, swimEquipmentLabels } from '../../types/swim'
import DurationInput from '../ui/DurationInput'

type IntervalFormData = {
  type: SwimIntervalType
  stroke: SwimStroke
  distanceMeters: number | null
  durationSeconds: number | null
  restSeconds: number | null
  rpe: number | null
  equipment: SwimEquipment[]
  notes: string
}

type SwimIntervalFormProps = {
  index: number
  interval: IntervalFormData
  onChange: (index: number, interval: IntervalFormData) => void
  onRemove: (index: number) => void
  canRemove: boolean
}

const intervalTypes: SwimIntervalType[] = ['WARMUP', 'WORK', 'DRILL', 'SPRINT', 'REST', 'COOLDOWN', 'OTHER']
const strokes: SwimStroke[] = ['FREESTYLE', 'BACKSTROKE', 'BREASTSTROKE', 'BUTTERFLY', 'MEDLEY', 'KICK', 'DRILL', 'OTHER']
const equipmentOptions: SwimEquipment[] = ['PADDLES', 'PULL_BUOY', 'FINS', 'KICKBOARD', 'SNORKEL', 'BAND']

function SwimIntervalForm({ index, interval, onChange, onRemove, canRemove }: SwimIntervalFormProps) {
  const updateField = <K extends keyof IntervalFormData>(field: K, value: IntervalFormData[K]) => {
    onChange(index, { ...interval, [field]: value })
  }

  const toggleEquipment = (eq: SwimEquipment) => {
    const current = interval.equipment
    if (current.includes(eq)) {
      updateField('equipment', current.filter(e => e !== eq))
    } else {
      updateField('equipment', [...current, eq])
    }
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

      {/* Tipo y Estilo */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tipo</label>
          <select
            value={interval.type}
            onChange={(e) => updateField('type', e.target.value as SwimIntervalType)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {intervalTypes.map(t => (
              <option key={t} value={t}>{swimIntervalTypeLabels[t]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Estilo</label>
          <select
            value={interval.stroke}
            onChange={(e) => updateField('stroke', e.target.value as SwimStroke)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {strokes.map(s => (
              <option key={s} value={s}>{swimStrokeLabels[s]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Distancia y Duración */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Distancia (m)</label>
          <input
            type="number"
            value={interval.distanceMeters ?? ''}
            onChange={(e) => updateField('distanceMeters', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="400"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Duración</label>
          <DurationInput
            value={interval.durationSeconds ?? 0}
            onChange={(secs) => updateField('durationSeconds', secs || null)}
          />
        </div>
      </div>

      {/* Descanso y RPE */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Descanso</label>
          <DurationInput
            value={interval.restSeconds ?? 0}
            onChange={(secs) => updateField('restSeconds', secs || null)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">RPE (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={interval.rpe ?? ''}
            onChange={(e) => updateField('rpe', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="7"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Material */}
      <div className="mb-3">
        <label className="block text-xs text-gray-500 mb-2">Material</label>
        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map(eq => (
            <button
              key={eq}
              type="button"
              onClick={() => toggleEquipment(eq)}
              className={`px-2 py-1 text-xs rounded-full border transition-colors ${interval.equipment.includes(eq)
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
            >
              {swimEquipmentLabels[eq]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SwimIntervalForm
export type { IntervalFormData as SwimIntervalFormData }