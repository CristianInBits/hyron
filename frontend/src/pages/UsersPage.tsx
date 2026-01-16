import { useEffect, useState } from 'react'
import { Users, Plus, UserPlus } from 'lucide-react'
import { userService } from '../services/userService'
import type { User, UserCreateRequest } from '../types/user'
import Modal from '../components/ui/Modal'
import UserForm from '../components/users/UserForm'
import UserCard from '../components/users/UserCard'

function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)

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

    const handleCreate = () => {
        setEditingUser(null)
        setIsModalOpen(true)
    }

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return

        try {
            await userService.delete(id)
            await loadUsers()
        } catch (err) {
            setError('Error al eliminar usuario')
            console.error(err)
        }
    }

    const handleSubmit = async (data: UserCreateRequest) => {
        if (editingUser) {
            await userService.update(editingUser.id, data)
        } else {
            await userService.create(data)
        }
        setIsModalOpen(false)
        await loadUsers()
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingUser(null)
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                        <Users className="w-7 h-7 text-gray-700" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
                        <p className="text-sm text-gray-500">Gestión de acceso y perfiles</p>
                    </div>
                </div>
                <button
                    className="flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all whitespace-nowrap"
                    onClick={handleCreate}
                >
                    <Plus className="w-5 h-5 sm:mr-1" />
                    <span className="hidden sm:inline">Nuevo Usuario</span>
                </button>
            </div>

            {loading && (
                <div className="py-12 text-center text-gray-500">
                    Cargando usuarios...
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <>
                    {users.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No hay usuarios registrados.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                            {users.map(user => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            >
                <UserForm
                    user={editingUser}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    )
}

export default UsersPage