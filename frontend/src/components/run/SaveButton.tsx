import { Save, Loader2 } from 'lucide-react'

type SaveButtonProps = {
    onClick: () => void
    loading?: boolean
    disabled?: boolean
    label?: string
}

function SaveButton({ onClick, loading = false, disabled = false, label = 'Guardar Actividad' }: SaveButtonProps) {
    return (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
            <button
                type="button"
                onClick={onClick}
                disabled={loading || disabled}
                className="w-full py-4 bg-gray-900 text-white font-bold text-lg rounded-2xl shadow-xl shadow-gray-300 hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
                {loading ? (
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

export default SaveButton