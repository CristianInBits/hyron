import { useEffect, useState } from 'react'
import { Home } from 'lucide-react'
import { userService } from '../services/userService'
import type { User } from '../types/user'

function HomePage() {
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

    return (
        <div>
            <div className="flex items-center mb-4">
                <Home className="w-7 h-7 mr-2 text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-800">Home</h1>
            </div>

            <h2 className="text-lg font-semibold text-gray-700 mb-3">Usuarios</h2>

            {loading && (
                <p className="text-gray-500">Cargando...</p>
            )}

            {error && (
                <p className="text-red-500">{error}</p>
            )}

            {!loading && !error && users.length === 0 && (
                <p className="text-gray-500">No hay usuarios</p>
            )}

            {!loading && !error && users.length > 0 && (
                <div className="space-y-2">
                    {users.map(user => (
                        <div key={user.id} className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="font-medium text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default HomePage