function ProfilePage() {
    return (
        <div className="space-y-6">
            {/* Cabecera del Perfil */}
            <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    👤
                </div>
                <div>
                    <h2 className="text-xl font-bold">Usuario</h2>
                    <p className="text-gray-500 text-sm">user@hyron.com</p>
                </div>
            </div>

            {/* Sección Catálogos */}
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Catálogos</h3>

                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-sm">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left">
                        <span className="flex items-center space-x-3">
                            <span>👟</span>
                            <span className="font-medium text-gray-700">Mis Zapatillas</span>
                        </span>
                        <span className="text-gray-400">›</span>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left">
                        <span className="flex items-center space-x-3">
                            <span>🏋️</span>
                            <span className="font-medium text-gray-700">Mis Ejercicios</span>
                        </span>
                        <span className="text-gray-400">›</span>
                    </button>
                </div>
            </div>

            {/* Sección Configuración */}
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">App</h3>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left text-red-600">
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;