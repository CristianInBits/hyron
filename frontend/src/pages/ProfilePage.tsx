import { useNavigate } from 'react-router-dom'
import { User, Footprints, Dumbbell, Settings, Users } from 'lucide-react'

function ProfilePage() {
    const navigate = useNavigate()

    const itemBase =
        'w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:bg-gray-50'

    const leftBase = 'flex items-center'
    const iconBase = 'p-2.5 rounded-lg mr-3'

    return (
        <div>
            <div className="flex items-center mb-4">
                <User className="w-7 h-7 mr-2 text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-800">Perfil</h1>
            </div>

            <div className="space-y-3">
                <button className={itemBase} onClick={() => navigate('/users')}>
                    <div className={leftBase}>
                        <div className={`${iconBase} bg-gray-100 text-gray-800`}>
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-gray-800 font-medium">Usuarios</span>
                    </div>
                    <span className="text-gray-400">›</span>
                </button>

                <button className={itemBase} onClick={() => navigate('/shoes')}>
                    <div className={leftBase}>
                        <div className={`${iconBase} bg-gray-100 text-gray-800`}>
                            <Footprints className="w-6 h-6" />
                        </div>
                        <span className="text-gray-800 font-medium">Mis Zapatillas</span>
                    </div>
                    <span className="text-gray-400">›</span>
                </button>

                <button className={itemBase} onClick={() => navigate('/exercises')}>
                    <div className={leftBase}>
                        <div className={`${iconBase} bg-gray-100 text-gray-800`}>
                            <Dumbbell className="w-6 h-6" />
                        </div>
                        <span className="text-gray-800 font-medium">Mis Ejercicios</span>
                    </div>
                    <span className="text-gray-400">›</span>
                </button>

                <button className={itemBase}>
                    <div className={leftBase}>
                        <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                            <Settings className="w-6 h-6" />
                        </div>
                        <span className="text-gray-800 font-medium">Configuración</span>
                    </div>
                    <span className="text-gray-400">›</span>
                </button>
            </div>
        </div>
    )
}

export default ProfilePage
