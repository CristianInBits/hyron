import { useEffect, useState } from 'react'
import { Users, Plus, Pencil, Trash2 } from 'lucide-react'
import { userService } from '../services/userService'
import type { User } from '../types/user'

function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            setLoading(true)
            const data = await userService.getAll()
            setUsers(data)
            setError(null)
        } catch (err) {
            setError('Error al cargar usuarios')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return

        try {
            await userService.delete(id)
            await loadUsers()
        } catch (err) {
            setError('Error al eliminar usuario')
            console.error(err)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Users className="w-7 h-7 mr-2 text-gray-700" />
                    <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
                </div>
                <button className="flex items-center bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700">
                    <Plus className="w-5 h-5 mr-1" />
                    <span>Nuevo</span>
                </button>
            </div>

            {loading && (
                <p className="text-gray-500">Cargando...</p>
            )}

            {error && (
                <p className="text-red-500 mb-4">{error}</p>
            )}

            {!loading && !error && users.length === 0 && (
                <p className="text-gray-500">No hay usuarios</p>
            )}

            {!loading && !error && users.length > 0 && (
                <div className="space-y-2">
                    {users.map(user => (
                        <div key={user.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-800">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default UsersPage