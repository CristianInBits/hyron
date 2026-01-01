import { Fish } from 'lucide-react'

function NewSwimPage() {
    return (
        <div className="bg-blue-50 min-h-screen -m-4 p-4">
            <div className="flex items-center mb-6">
                <Fish className="w-10 h-10 mr-3 text-blue-600" />
                <h1 className="text-2xl font-bold text-blue-700">Nuevo Swim</h1>
            </div>
            <p className="text-blue-600">Formulario de natación</p>
        </div>
    )
}

export default NewSwimPage