import { useEffect, useState } from 'react'
import { ChevronDown, User, RefreshCw } from 'lucide-react'
import { userService } from '../../services/userService'
import type { User as UserType } from '../../types/user'

type UserSelectorProps = {
    selectedUserId: number | null
    onUserChange: (userId: number) => void
}

function UserSelector({ selectedUserId, onUserChange }: UserSelectorProps) {
    const [users, setUsers] = useState<UserType[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const loadUsers = async () => {
        try {
            setLoading(true)
            const data = await userService.getAll()
            setUsers(data)
            if (!selectedUserId && data.length > 0) {
                onUserChange(data[0].id)
            }
        } catch (err) {
            console.error('Error loading users:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    // Recargar cuando el dropdown se abre
    const handleOpen = async () => {
        if (!isOpen) {
            await loadUsers()
        }
        setIsOpen(!isOpen)
    }

    const selectedUser = users.find(u => u.id === selectedUserId)

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center text-gray-400 text-sm">
                <User className="w-4 h-4 mr-1" />
                <span>Cargando...</span>
            </div>
        )
    }

    if (!loading && users.length === 0) {
        return (
            <div className="flex items-center text-gray-400 text-sm">
                <User className="w-4 h-4 mr-1" />
                <span>Sin usuarios</span>
            </div>
        )
    }

    return (
        <div className="relative">
            <button
                onClick={handleOpen}
                className="flex items-center text-gray-700 hover:text-gray-900 text-sm"
            >
                <User className="w-4 h-4 mr-1" />
                <span className="font-medium">{selectedUser?.name || 'Seleccionar'}</span>
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        {loading ? (
                            <div className="px-4 py-2 text-sm text-gray-400 flex items-center">
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Cargando...
                            </div>
                        ) : (
                            users.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => {
                                        onUserChange(user.id)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${user.id === selectedUserId ? 'bg-gray-100 font-medium' : ''
                                        }`}
                                >
                                    {user.name}
                                </button>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default UserSelector