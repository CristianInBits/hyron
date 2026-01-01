import { Home } from 'lucide-react'

function HomePage() {
    return (
        <div>
            <div className="flex items-center mb-4">
                <Home className="w-7 h-7 mr-2 text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-800">Home</h1>
            </div>
            <p className="text-gray-600">Resumen de tus entrenamientos</p>
        </div>
    )
}

export default HomePage