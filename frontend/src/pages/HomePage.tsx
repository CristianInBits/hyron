import { Home } from 'lucide-react'

type HomePageProps = {
    userId: number | null
}

function HomePage({ userId }: HomePageProps) {
    return (
        <div>
            <div className="flex items-center mb-4">
                <Home className="w-7 h-7 mr-2 text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-800">Home</h1>
            </div>

            {userId ? (
                <p className="text-gray-600">Bienvenido. Usuario ID: {userId}</p>
            ) : (
                <p className="text-gray-500">Selecciona un usuario en la cabecera</p>
            )}
        </div>
    )
}

export default HomePage