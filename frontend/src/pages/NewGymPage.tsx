import { Dumbbell } from 'lucide-react'

function NewGymPage() {
    return (
        <div className="bg-purple-50 min-h-screen -m-4 p-4">
            <div className="flex items-center mb-6">
                <Dumbbell className="w-10 h-10 mr-3 text-purple-600" />
                <h1 className="text-2xl font-bold text-purple-700">Nuevo Gym</h1>
            </div>
            <p className="text-purple-600">Formulario de gimnasio</p>
        </div>
    )
}

export default NewGymPage