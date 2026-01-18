import { Loader2, Save } from 'lucide-react'
import type { ColorVariant } from '../../types/ui'

type SaveButtonProps = {
    onClick?: () => void
    isLoading?: boolean
    disabled?: boolean
    label?: string
    color?: ColorVariant
    type?: 'button' | 'submit' // Importante para formularios
}

const THEME: Record<ColorVariant, string> = {
    green: 'bg-green-500 hover:bg-green-600 shadow-green-200 text-white',
    blue: 'bg-blue-500 hover:bg-blue-600 shadow-blue-200 text-white',
    purple: 'bg-purple-600 hover:bg-purple-700 shadow-purple-200 text-white',
    hyrox: 'bg-yellow-400 hover:bg-yellow-500 shadow-yellow-200 text-black',
}

export default function SaveButton({
    onClick,
    isLoading = false,
    disabled = false,
    label = 'Guardar Actividad',
    color = 'green',
    type = 'button'
}: SaveButtonProps) {

    const themeClass = THEME[color]

    return (
        <div className="w-full">
            {/* Wrapper por si quieres hacerlo sticky en el futuro */}
            <button
                type={type}
                onClick={onClick}
                disabled={disabled || isLoading}
                className={`
                    w-full py-4 rounded-2xl font-bold text-lg shadow-lg transform transition-all duration-200
                    flex items-center justify-center gap-2
                    active:scale-[0.98] 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none
                    ${themeClass}
                `}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Guardando...</span>
                    </>
                ) : (
                    <>
                        <Save className="w-5 h-5" />
                        <span>{label}</span>
                    </>
                )}
            </button>
        </div>
    )
}