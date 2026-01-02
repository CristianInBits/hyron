import { Dumbbell } from 'lucide-react'

type NewGymPageProps = {
    userId: number | null
}

function NewGymPage({ userId }: NewGymPageProps) {
    if (!userId) {
        return (
            <div className="bg-gray-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <Dumbbell className="w-10 h-10 mr-3 text-gray-700" />
                    <h1 className="text-2xl font-bold text-gray-800">Nuevo Gym</h1>
                </div>
                <p className="text-gray-700">Selecciona un usuario primero</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen -m-4 p-4">
            <div className="flex items-center mb-6">
                <Dumbbell className="w-10 h-10 mr-3 text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-800">Nuevo Gym</h1>
            </div>
            <p className="text-gray-700">Formulario de gym (Usuario: {userId})</p>
        </div>
    )
}

export default NewGymPage
