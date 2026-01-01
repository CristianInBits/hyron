function ProfilePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">👤 Perfil</h1>

            <div className="space-y-3">
                <button className="w-full flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                    <span className="text-xl mr-3">👟</span>
                    <span className="text-gray-700">Mis Zapatillas</span>
                </button>

                <button className="w-full flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                    <span className="text-xl mr-3">🏋️</span>
                    <span className="text-gray-700">Mis Ejercicios</span>
                </button>

                <button className="w-full flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                    <span className="text-xl mr-3">⚙️</span>
                    <span className="text-gray-700">Configuración</span>
                </button>
            </div>
        </div>
    )
}

export default ProfilePage