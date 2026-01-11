import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, ClipboardList, Plus, User, Dog, Fish, Dumbbell, Flame } from 'lucide-react'

function BottomNav() {
    const [showNewMenu, setShowNewMenu] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        document.body.style.overflow = showNewMenu ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [showNewMenu])

    const goTo = (path: string) => {
        navigate(path)
        setShowNewMenu(false)
    }

    const isActive = (path: string) => {
        return location.pathname === path
    }

    return (
        <>
            {/* Menú selector de tipo de workout */}
            {showNewMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowNewMenu(false)}>
                    <div
                        className="fixed bottom-20 left-4 right-4 bg-white rounded-xl p-4 z-50 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                            ¿Qué vas a entrenar?
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100"
                                onClick={() => goTo('/new/run')}
                            >
                                <Dog className="w-8 h-8 mb-1 text-green-500" />
                                <span className="text-green-600 font-medium">Run</span>
                            </button>

                            <button
                                className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100"
                                onClick={() => goTo('/new/swim')}
                            >
                                <Fish className="w-8 h-8 mb-1 text-blue-500" />
                                <span className="text-blue-600 font-medium">Swim</span>
                            </button>

                            <button
                                className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100"
                                onClick={() => goTo('/new/gym')}
                            >
                                <Dumbbell className="w-8 h-8 mb-1 text-purple-500" />
                                <span className="text-purple-600 font-medium">Gym</span>
                            </button>

                            <button
                                className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100"
                                onClick={() => goTo('/new/hyrox')}
                            >
                                <Flame className="w-8 h-8 mb-1 text-orange-500" />
                                <span className="text-orange-600 font-medium">Hyrox</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Barra de navegación */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
                <div className="flex justify-around items-center h-16">

                    <button
                        className={`flex flex-col items-center ${isActive('/') ? 'text-gray-800' : 'text-gray-400'}`}
                        onClick={() => goTo('/')}
                    >
                        <Home className="w-6 h-6" />
                        <span className="text-xs">Home</span>
                    </button>

                    <button
                        className={`flex flex-col items-center ${isActive('/workouts') ? 'text-gray-800' : 'text-gray-400'}`}
                        onClick={() => goTo('/workouts')}
                    >
                        <ClipboardList className="w-6 h-6" />
                        <span className="text-xs">Workouts</span>
                    </button>

                    <button
                        className="flex flex-col items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowNewMenu(!showNewMenu)}
                    >
                        <Plus className="w-6 h-6" />
                        <span className="text-xs">Nuevo</span>
                    </button>

                    <button
                        className={`flex flex-col items-center ${isActive('/profile') ? 'text-gray-800' : 'text-gray-400'}`}
                        onClick={() => goTo('/profile')}
                    >
                        <User className="w-6 h-6" />
                        <span className="text-xs">Perfil</span>
                    </button>

                </div>
            </nav>
        </>
    )
}

export default BottomNav