import { useEffect, useState } from 'react'
import { Footprints, Plus } from 'lucide-react'
import { shoeService } from '../services/shoeService'
import type { Shoe, ShoeCreateRequest, ShoeUpdateRequest } from '../types/shoe'
import Modal from '../components/ui/Modal'
import ShoeCard from '../components/shoes/ShoeCard'
import ShoeForm from '../components/shoes/ShoeForm'

type ShoesPageProps = {
    userId: number | null
}

function ShoesPage({ userId }: ShoesPageProps) {
    const [shoes, setShoes] = useState<Shoe[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingShoe, setEditingShoe] = useState<Shoe | null>(null)

    useEffect(() => {
        if (userId) {
            loadShoes()
        }
    }, [userId])

    const loadShoes = async () => {
        if (!userId) return

        try {
            setLoading(true)
            const data = await shoeService.getAll(userId)
            setShoes(data)
            setError(null)
        } catch (err) {
            setError('Error al cargar zapatillas')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setEditingShoe(null)
        setIsModalOpen(true)
    }

    const handleEdit = (shoe: Shoe) => {
        setEditingShoe(shoe)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!userId) return
        if (!confirm('¿Estás seguro de eliminar esta zapatilla permanentemente?')) return

        try {
            await shoeService.delete(userId, id)
            await loadShoes()
        } catch (err) {
            setError('Error al eliminar zapatilla')
            console.error(err)
        }
    }

    const handleToggleActive = async (shoe: Shoe) => {
        if (!userId) return

        try {
            const updateData: ShoeUpdateRequest = { active: !shoe.active }
            await shoeService.update(userId, shoe.id, updateData)
            await loadShoes()
        } catch (err) {
            setError('Error al actualizar zapatilla')
            console.error(err)
        }
    }

    const handleSubmit = async (data: ShoeCreateRequest) => {
        if (!userId) return

        if (editingShoe) {
            const updateData: ShoeUpdateRequest = { ...data }
            await shoeService.update(userId, editingShoe.id, updateData)
        } else {
            await shoeService.create(userId, data)
        }
        setIsModalOpen(false)
        await loadShoes()
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingShoe(null)
    }

    const activeShoes = shoes.filter(s => s.active)
    const inactiveShoes = shoes.filter(s => !s.active)

    if (!userId) {
        return (
            <div>
                <div className="flex items-center mb-4">
                    <Footprints className="w-7 h-7 mr-2 text-gray-700" />
                    <h1 className="text-2xl font-bold text-gray-800">Zapatillas</h1>
                </div>
                <p className="text-gray-500">Selecciona un usuario para ver sus zapatillas</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Footprints className="w-7 h-7 mr-2 text-gray-700" />
                    <h1 className="text-2xl font-bold text-gray-800">Zapatillas</h1>
                </div>
                <button
                    className="flex items-center bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                    onClick={handleCreate}
                >
                    <Plus className="w-5 h-5 mr-1" />
                    <span>Nueva</span>
                </button>
            </div>

            {loading && <p className="text-gray-500">Cargando...</p>}

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {!loading && !error && shoes.length === 0 && (
                <p className="text-gray-500">No hay zapatillas</p>
            )}

            {!loading && !error && shoes.length > 0 && (
                <>
                    {/* Zapatillas activas */}
                    {activeShoes.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {activeShoes.map(shoe => (
                                <ShoeCard
                                    key={shoe.id}
                                    shoe={shoe}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onToggleActive={handleToggleActive}
                                />
                            ))}
                        </div>
                    )}

                    {/* Zapatillas retiradas */}
                    {inactiveShoes.length > 0 && (
                        <>
                            <h2 className="text-sm font-medium text-gray-500 mb-3">Retiradas</h2>
                            <div className="space-y-3">
                                {inactiveShoes.map(shoe => (
                                    <ShoeCard
                                        key={shoe.id}
                                        shoe={shoe}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onToggleActive={handleToggleActive}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingShoe ? 'Editar Zapatilla' : 'Nueva Zapatilla'}
            >
                <ShoeForm
                    shoe={editingShoe}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    )
}

export default ShoesPage