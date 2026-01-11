import { useState } from 'react'
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import type { HyroxStation } from '../../types/hyrox'
import HyroxItemForm from './HyroxItemForm'
import type { ItemFormData } from './HyroxItemForm'
import { Input, Label, DurationInput } from '../ui'

export type BlockFormData = {
    restDurationSeconds: number | null
    notes: string
    items: ItemFormData[]
}

type HyroxBlockFormProps = {
    index: number
    block: BlockFormData
    onChange: (index: number, block: BlockFormData) => void
    onRemove: (index: number) => void
    canRemove: boolean
}

const emptyItem: ItemFormData = {
    station: 'RUN',
    durationSeconds: 0,
    recoveryDurationSeconds: null,
    distanceMeters: null,
    reps: null,
    weightKg: null,
    averageHr: null,
    rpe: null,
    notes: '',
}

function HyroxBlockForm({ index, block, onChange, onRemove, canRemove }: HyroxBlockFormProps) {
    const [isExpanded, setIsExpanded] = useState(true)

    const updateField = <K extends keyof BlockFormData>(field: K, value: BlockFormData[K]) => {
        onChange(index, { ...block, [field]: value })
    }

    const handleAddItem = () => {
        const nextStation: HyroxStation = block.items.length % 2 === 0 ? 'RUN' : 'SKI_ERG'
        updateField('items', [...block.items, { ...emptyItem, station: nextStation }])
    }

    const handleUpdateItem = (itemIndex: number, item: ItemFormData) => {
        const updated = [...block.items]
        updated[itemIndex] = item
        updateField('items', updated)
    }

    const handleRemoveItem = (itemIndex: number) => {
        updateField('items', block.items.filter((_, i) => i !== itemIndex))
    }

    const totalBlockTime = block.items.reduce((sum, item) => {
        return sum + item.durationSeconds + (item.recoveryDurationSeconds ?? 0)
    }, 0) + (block.restDurationSeconds ?? 0)

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="bg-orange-50 rounded-xl border-2 border-orange-200 overflow-hidden">
            {/* Cabecera del bloque */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-orange-100 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center">
                    <span className="text-xl font-bold text-orange-600 mr-3">R{index + 1}</span>
                    <div>
                        <span className="font-medium text-gray-800">Ronda {index + 1}</span>
                        <span className="text-sm text-gray-500 ml-2">
                            ({block.items.length} estaciones • {formatTime(totalBlockTime)})
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {canRemove && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                onRemove(index)
                            }}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                            <Trash2 className="w-5 h-5" />
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
                <div className="p-4 pt-0">
                    {/* Estaciones/Items */}
                    <div className="space-y-3 mb-4">
                        {block.items.map((item, itemIndex) => (
                            <HyroxItemForm
                                key={itemIndex}
                                index={itemIndex}
                                item={item}
                                onChange={handleUpdateItem}
                                onRemove={handleRemoveItem}
                                canRemove={block.items.length > 1}
                            />
                        ))}
                    </div>

                    {/* Añadir estación */}
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="w-full py-2 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg hover:bg-orange-100 flex items-center justify-center text-sm mb-4 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir estación
                    </button>

                    {/* Descanso y notas del bloque */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-orange-200">
                        <div>
                            <Label>Descanso tras ronda</Label>
                            <DurationInput
                                value={block.restDurationSeconds ?? 0}
                                onChange={(secs) => updateField('restDurationSeconds', secs || null)}
                                variant="orange"
                            />
                        </div>
                        <div>
                            <Label>Notas</Label>
                            <Input
                                type="text"
                                value={block.notes}
                                onChange={(e) => updateField('notes', e.target.value)}
                                placeholder="Notas de la ronda..."
                                variant="orange"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HyroxBlockForm