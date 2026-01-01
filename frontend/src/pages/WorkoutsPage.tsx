import { ClipboardList } from 'lucide-react'

function WorkoutsPage() {
    return (
        <div>
            <div className="flex items-center mb-4">
                <ClipboardList className="w-7 h-7 mr-2 text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-800">Workouts</h1>
            </div>
            <p className="text-gray-600">Lista de todos tus entrenamientos</p>
        </div>
    )
}

export default WorkoutsPage