import { useEffect, useState } from 'react'
import { Users, Plus } from 'lucide-react'
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
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return

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
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Users className="w-7 h-7 mr-2 text-gray-700" />
                    <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
                </div>
                <button
                    className="flex items-center bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                    onClick={handleCreate}
                >
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
                <div className="space-y-3">
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