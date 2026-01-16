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
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Footprints className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Zapatillas</h2>
                <p className="text-gray-500">Selecciona un usuario para ver sus zapatillas</p>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                        <Footprints className="w-7 h-7 text-gray-700" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Zapatillas</h1>
                        <p className="text-sm text-gray-500">Gestión de material</p>
                    </div>
                </div>
                <button
                    className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all"
                    onClick={handleCreate}
                >
                    <Plus className="w-5 h-5 mr-1" />
                    <span>Nueva</span>
                </button>
            </div>

            {loading && <p className="text-gray-500 text-center py-12">Cargando...</p>}

            {error && (
                <div className="text-red-600 mb-4 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                    {error}
                </div>
            )}

            {!loading && !error && shoes.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <Footprints className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No tienes zapatillas registradas</p>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                    >
                        Añadir zapatilla
                    </button>
                </div>
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
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                                Retiradas
                                <span className="ml-2 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                                    {inactiveShoes.length}
                                </span>
                            </h2>
                            <div className="space-y-3 opacity-75">
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
                        </div>
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