import { Users, Pencil, Trash2, Calendar, Mail } from 'lucide-react'
import type { User } from '../../types/user'

type UserCardProps = {
    user: User
    onEdit: (user: User) => void
    onDelete: (id: number) => void
}

function UserCard({ user, onEdit, onDelete }: UserCardProps) {
    const formattedDate = user.registeredAt
        ? new Date(user.registeredAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
        : 'N/A'

    return (
        <div
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 overflow-hidden
            transition-all duration-200
            hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-50/50 hover:ring-1 hover:ring-slate-200 hover:border-slate-300"
        >
            <div className="flex items-start justify-between">
                {/* Info */}
                <div className="flex items-start flex-1 min-w-0 mr-4">
                    <div className="p-3 rounded-lg mr-4 bg-gray-100 text-gray-600 flex-shrink-0">
                        <Users className="w-6 h-6" />
                    </div>

                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-800 text-lg truncate mb-1">
                            {user.name}
                        </h3>

                        <div className="flex items-center text-sm text-gray-500 mb-1">
                            <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            <span className="truncate">{user.email}</span>
                        </div>

                        <div className="flex items-center text-xs text-gray-400">
                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                            <span>Registrado el {formattedDate}</span>
                        </div>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-1">
                    <button
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={(e) => { e.stopPropagation(); onEdit(user); }}
                        title="Editar"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>

                    <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={(e) => { e.stopPropagation(); onDelete(user.id); }}
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