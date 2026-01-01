function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <div className="flex justify-around items-center h-16">

                {/* Home - Neutral */}
                <button className="flex flex-col items-center text-gray-600 hover:text-gray-800">
                    <span className="text-xl">🏠</span>
                    <span className="text-xs">Home</span>
                </button>

                {/* Run - Galgo - Verde */}
                <button className="flex flex-col items-center text-green-500 hover:text-green-600">
                    <span className="text-xl">🐕</span>
                    <span className="text-xs">Run</span>
                </button>

                {/* Swim - Foca - Azul */}
                <button className="flex flex-col items-center text-blue-500 hover:text-blue-600">
                    <span className="text-xl">🦭</span>
                    <span className="text-xs">Swim</span>
                </button>

                {/* Gym - Gorila - Morado */}
                <button className="flex flex-col items-center text-purple-500 hover:text-purple-600">
                    <span className="text-xl">🦍</span>
                    <span className="text-xs">Gym</span>
                </button>

                {/* Hyrox - Tigre - Naranja */}
                <button className="flex flex-col items-center text-orange-500 hover:text-orange-600">
                    <span className="text-xl">🐅</span>
                    <span className="text-xs">Hyrox</span>
                </button>

            </div>
        </nav>
    )
}

export default BottomNav