import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { Textarea } from '../ui'

type NotesCollapsibleProps = {
    value: string
    onChange: (value: string) => void
}

function NotesCollapsible({ value, onChange }: NotesCollapsibleProps) {
    const [isOpen, setIsOpen] = useState(!!value)

    return (
        <div className="px-4 py-3">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
                <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                        {value ? 'Notas añadidas' : 'Añadir notas...'}
                    </span>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5" />
                ) : (
                    <ChevronDown className="w-5 h-5" />
                )}
            </button>

            {isOpen && (
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="¿Cómo ha ido el entreno? Sensaciones, terreno, clima..."
                    rows={3}
                    variant="green"
                    className="mt-2"
                />
            )}
        </div>
    )
}

export default NotesCollapsible