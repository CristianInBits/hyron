import { useNavigate } from 'react-router-dom'
import { User, Footprints, Dumbbell, Settings, Users } from 'lucide-react'

function ProfilePage() {
    const navigate = useNavigate()

    return (
        <div>
            <div className="flex items-center mb-4">
                <User className="w-7 h-7 mr-2 text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-800">Perfil</h1>
            </div>

            <div className="space-y-3">
                <button
                    className="w-full flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                    onClick={() => navigate('/users')}
                >
                    <Users className="w-6 h-6 mr-3 text-gray-600" />
                    <span className="text-gray-700">Usuarios</span>
                </button>

                <button className="w-full flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                    <Footprints className="w-6 h-6 mr-3 text-gray-600" />
                    <span className="text-gray-700">Mis Zapatillas</span>
                </button>

                <button className="w-full flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                    <Dumbbell className="w-6 h-6 mr-3 text-gray-600" />
                    <span className="text-gray-700">Mis Ejercicios</span>
                </button>

                <button className="w-full flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                    <Settings className="w-6 h-6 mr-3 text-gray-600" />
                    <span className="text-gray-700">Configuración</span>
                </button>
            </div>
        </div>
    )
}

export default ProfilePage