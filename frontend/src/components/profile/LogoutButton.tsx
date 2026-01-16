import { LogOut } from 'lucide-react'

type LogoutButtonProps = {
    onLogout: () => void
    version?: string
}

function LogoutButton({ onLogout, version = '1.0.0' }: LogoutButtonProps) {
    return (
        <div className="px-4">
            <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center p-4 rounded-xl bg-gray-900 text-white font-medium shadow-lg shadow-gray-200 hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                <LogOut className="w-5 h-5 mr-2" />
                Cerrar Sesión
            </button>

            <p className="text-center text-xs text-gray-300 mt-4">Versión {version}</p>
        </div>
    )
}

export default LogoutButton