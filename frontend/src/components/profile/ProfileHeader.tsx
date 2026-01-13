import { Calendar, Settings } from 'lucide-react'
import type { User as UserType } from '../../types/user'

type ProfileHeaderProps = {
    user: UserType
    formattedDate: string
    onEditClick?: () => void
    isPro?: boolean
}

function ProfileHeader({ user, formattedDate, onEditClick, isPro = true }: ProfileHeaderProps) {
    const initial = user.name?.charAt(0)?.toUpperCase() ?? '?'

    return (
        <div className="flex flex-col items-center pt-6 pb-8">
            <div className="relative mb-4">
                {/* Avatar Placeholder */}
                <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center text-gray-500 text-3xl font-bold">
                    {initial}
                </div>

                {/* Badge de edición */}
                <button
                    type="button"
                    onClick={onEditClick}
                    className="absolute bottom-0 right-1 bg-gray-900 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-700 transition-colors"
                    aria-label="Editar perfil"
                >
                    <Settings className="w-4 h-4" />
                </button>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>

            {isPro && (
                <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider mb-3">
                    PRO MEMBER
                </span>
            )}

            <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>Miembro desde {formattedDate}</span>
            </div>
        </div>
    )
}

export default ProfileHeader