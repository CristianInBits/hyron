import { Users, Pencil, Trash2 } from 'lucide-react'
import type { User } from '../../types/user'

type UserCardProps = {
    user: User
    onEdit: (user: User) => void
    onDelete: (id: number) => void
}

function UserCard({ user, onEdit, onDelete }: UserCardProps) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
                {/* Info */}
                <div className="flex items-start flex-1">
                    <div className="p-2.5 rounded-lg mr-3 bg-green-50 text-green-600">
                        <Users className="w-6 h-6" />
                    </div>

                    <div className="w-full mr-4">
                        <h3 className="font-semibold text-gray-800 text-lg">
                            {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1">
                    <button
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => onEdit(user)}
                        title="Editar"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>

                    <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => onDelete(user.id)}
                        title="Eliminar"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserCard
