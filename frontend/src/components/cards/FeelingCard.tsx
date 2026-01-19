import { Smile } from 'lucide-react'
import type { ColorVariant } from '../../types/ui'
import { FEELINGS } from '../../constants/activity'

type FeelingCardProps = {
    value: number | null
    onChange: (val: number | null) => void
    color?: ColorVariant
}

const THEME: Record<ColorVariant, { text: string }> = {
    green: { text: 'text-emerald-600' },
    blue: { text: 'text-blue-600' },
    purple: { text: 'text-purple-600' },
    hyrox: { text: 'text-yellow-700' },
}

export default function FeelingCard({ value, onChange, color = 'green' }: FeelingCardProps) {
    const styles = THEME[color]

    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm select-none">
            <div className="flex items-center text-gray-400 mb-4">
                <Smile className={`w-4 h-4 mr-2 ${value ? styles.text : ''}`} />
                <span className="text-xs font-bold uppercase tracking-wider">Sensaciones</span>
            </div>

            <div className="flex justify-between items-end px-2 pb-2">
                {FEELINGS.map((f) => {
                    const isSelected = value === f.value

                    return (
                        <button
                            key={f.value}
                            type="button"
                            onClick={() => onChange(isSelected ? null : f.value)}
                            className={`
                                group flex flex-col items-center transition-all duration-300 relative
                                ${isSelected
                                    ? '-translate-y-2 opacity-100'
                                    : 'opacity-50 hover:opacity-50 hover:-translate-y-1'
                                }
                            `}
                        >
                            <div className={`
                                text-3xl transition-transform duration-300
                                ${isSelected
                                    ? 'scale-125 drop-shadow-md grayscale-0'
                                    : 'scale-100 grayscale-[0.8]'
                                }
                            `}>
                                {f.emoji}
                            </div>

                            {/* CORRECCIÓN AQUÍ: El texto solo depende de isSelected */}
                            <span className={`
                                absolute -bottom-5 text-[10px] font-bold uppercase tracking-tight whitespace-nowrap transition-all duration-200
                                ${isSelected
                                    ? styles.text + ' opacity-100 translate-y-0'
                                    : 'text-gray-400 opacity-0 translate-y-2 pointer-events-none'
                                }
                            `}>
                                {f.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}