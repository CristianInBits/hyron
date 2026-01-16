import { useState, useEffect } from 'react'
import { getErrorMessage } from '../../services/errorHandler'
import type { User, UserCreateRequest } from '../../types/user'
import { Input, Label } from '../ui'

type UserFormProps = {
    user?: User | null
    onSubmit: (data: UserCreateRequest) => Promise<void>
    onCancel: () => void
}

function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
        } else {
            setName('')
            setEmail('')
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            setError('El nombre es obligatorio')
            return
        }
        if (!email.trim()) {
            setError('El email es obligatorio')
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('El formato del email no es válido')
            return
        }

        try {
            setLoading(true)
            setError(null)
            await onSubmit({ name: name.trim(), email: email.trim() })
        } catch (err) {
            setError(getErrorMessage(err))
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <Label>Nombre completo</Label>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    autoFocus
                />
            </div>

            <div className="mb-6">
                <Label>Correo electrónico</Label>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@ejemplo.com"
                />
            </div>

            <div className="flex space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-lg shadow-gray-200"
                >
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    )
}

export default UserForm