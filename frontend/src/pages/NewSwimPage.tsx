import { Fish } from 'lucide-react'

type NewSwimPageProps = {
    userId: number | null
}

function NewSwimPage({ userId }: NewSwimPageProps) {
    if (!userId) {
        return (
            <div className="bg-green-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <Fish className="w-10 h-10 mr-3 text-green-600" />
                    <h1 className="text-2xl font-bold text-green-700">Nuevo Swim</h1>
                </div>
                <p className="text-green-600">Selecciona un usuario primero</p>
            </div>
        )
    }

    return (
        <div className="bg-green-50 min-h-screen -m-4 p-4">
            <div className="flex items-center mb-6">
                <Fish className="w-10 h-10 mr-3 text-green-600" />
                <h1 className="text-2xl font-bold text-green-700">Nuevo Swim</h1>
            </div>
            <p className="text-green-600">Formulario de natación (Usuario: {userId})</p>
        </div>
    )
}

export default NewSwimPage