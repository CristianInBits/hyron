import { useState } from 'react'

function BottomNav() {
    const [showNewMenu, setShowNewMenu] = useState(false)

    return (
        <>
            {/* Menú selector de tipo de workout */}
            {showNewMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowNewMenu(false)}>
                    <div
                        className="fixed bottom-20 left-4 right-4 bg-white rounded-xl p-4 z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                            ¿Qué vas a entrenar?
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100">
                                <span className="text-3xl mb-1">🐕</span>
                                <span className="text-green-600 font-medium">Run</span>
                            </button>

                            <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
                                <span className="text-3xl mb-1">🦭</span>
                                <span className="text-blue-600 font-medium">Swim</span>
                            </button>

                            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100">
                                <span className="text-3xl mb-1">🦍</span>
                                <span className="text-purple-600 font-medium">Gym</span>
                            </button>

                            <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100">
                                <span className="text-3xl mb-1">🐅</span>
                                <span className="text-orange-600 font-medium">Hyrox</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Barra de navegación */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
                <div className="flex justify-around items-center h-16">

                    <button className="flex flex-col items-center text-gray-600 hover:text-gray-800">
                        <span className="text-xl">🏠</span>
                        <span className="text-xs">Home</span>
                    </button>

                    <button className="flex flex-col items-center text-gray-600 hover:text-gray-800">
                        <span className="text-xl">📋</span>
                        <span className="text-xs">Workouts</span>
                    </button>

                    <button
                        className="flex flex-col items-center text-gray-600 hover:text-gray-800"
                        onClick={() => setShowNewMenu(!showNewMenu)}
                    >
                        <span className="text-xl">➕</span>
                        <span className="text-xs">Nuevo</span>
                    </button>

                    <button className="flex flex-col items-center text-gray-600 hover:text-gray-800">
                        <span className="text-xl">👤</span>
                        <span className="text-xs">Perfil</span>
                    </button>

                </div>
            </nav>
        </>
    )
}

export default BottomNav