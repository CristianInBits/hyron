import { useState } from 'react'
import { FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { Textarea } from '../ui' // Tu componente base
import type { ColorVariant } from '../../types/ui'

type NotesCardProps = {
    value: string
    onChange: (value: string) => void
    color?: ColorVariant
    placeholder?: string
}

const THEME: Record<ColorVariant, { icon: string, border: string, ring: string }> = {
    green: { icon: 'text-green-500', border: 'border-green-500', ring: 'ring-green-100' },
    blue: { icon: 'text-blue-500', border: 'border-blue-500', ring: 'ring-blue-100' },
    purple: { icon: 'text-purple-500', border: 'border-purple-500', ring: 'ring-purple-100' },
    hyrox: { icon: 'text-yellow-600', border: 'border-yellow-500', ring: 'ring-yellow-100' },
}

export default function NotesCard({
    value,
    onChange,
    color = 'green',
    placeholder = "¿Qué tal el entrenamiento? Sensaciones, terreno..."
}: NotesCardProps) {
    // Si hay valor, empezamos abiertos.
    const [isOpen, setIsOpen] = useState(!!value)
    const styles = THEME[color]

    return (
        <div
            className={`
                bg-white rounded-2xl p-4 border transition-all duration-300
                ${isOpen
                    ? `${styles.border} shadow-sm ring-1 ${styles.ring}`
                    : 'border-gray-100 hover:border-gray-200 shadow-sm'
                }
            `}
        >
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left group focus:outline-none"
            >
                <div className="flex items-center text-gray-400 group-hover:text-gray-600 transition-colors">
                    <FileText className={`w-4 h-4 mr-2 transition-colors ${isOpen || value ? styles.icon : ''}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isOpen ? 'text-gray-700' : ''}`}>
                        Notas
                    </span>
                </div>

                <div className="flex items-center">
                    {/* Previsualización inteligente */}
                    {!isOpen && value && (
                        <span className="text-xs text-gray-400 mr-2 truncate max-w-[150px] italic">
                            {value}
                        </span>
                    )}
                    {isOpen
                        ? <ChevronUp className={`w-4 h-4 ${styles.icon}`} />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />
                    }
                </div>
            </button>

            {isOpen && (
                <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        rows={3}
                        autoFocus // UX: Teclado arriba al abrir
                        // Truco para poner cursor al final
                        onFocus={(e) => {
                            const val = e.target.value;
                            e.target.value = '';
                            e.target.value = val;
                        }}
                        className="w-full bg-gray-50 border-0 focus:ring-0 rounded-xl p-3 text-gray-700 placeholder-gray-400 resize-none text-sm leading-relaxed"
                    />
                </div>
            )}
        </div>
    )
}