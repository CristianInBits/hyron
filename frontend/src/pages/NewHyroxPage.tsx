import { Flame } from 'lucide-react'

function NewHyroxPage() {
    return (
        <div className="bg-orange-50 min-h-screen -m-4 p-4">
            <div className="flex items-center mb-6">
                <Flame className="w-10 h-10 mr-3 text-orange-600" />
                <h1 className="text-2xl font-bold text-orange-700">Nuevo Hyrox</h1>
            </div>
            <p className="text-orange-600">Formulario de Hyrox</p>
        </div>
    )
}

export default NewHyroxPage