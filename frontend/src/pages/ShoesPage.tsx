import { useState } from 'react'
import { Footprints, Plus } from 'lucide-react'
import { useQueryClient, useMutation } from '@tanstack/react-query'

// IMPORTS NUEVOS: Traemos los hooks y tipos
import { useShoes, useCreateShoe, useUpdateShoe, useDeleteShoe } from '../hooks/useShoes'
import type { Shoe, ShoeCreateRequest, ShoeUpdateRequest } from '../types/shoe'
import { shoeService } from '../services/shoeService'

import Modal from '../components/ui/Modal'
import ShoeCard from '../components/shoes/ShoeCard'
import ShoeForm from '../components/shoes/ShoeForm'

function ShoesPage() {

    // 1. CARGA DE DATOS AUTOMÁTICA 📡
    // params vacío = carga la primera página por defecto
    const { data, isLoading, isError, error } = useShoes();

    // Extraemos la lista real del objeto paginado
    const shoes = data?.content || [];

    // 2. HOOKS DE ACCIÓN ⚡
    const createMutation = useCreateShoe();
    const updateMutation = useUpdateShoe();
    const deleteMutation = useDeleteShoe();

    // Hook manual para el Toggle (porque no lo creamos en useShoes.ts)
    const queryClient = useQueryClient();
    const toggleMutation = useMutation({
        mutationFn: (shoe: Shoe) => shoeService.toggleActive(shoe),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shoes'] })
    });

    // 3. ESTADOS DE LA UI (Modal) 🖼️
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingShoe, setEditingShoe] = useState<Shoe | null>(null)

    // --- MANEJADORES DE EVENTOS ---

    const handleCreate = () => {
        setEditingShoe(null)
        setIsModalOpen(true)
    }

    const handleEdit = (shoe: Shoe) => {
        setEditingShoe(shoe)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta zapatilla permanentemente?')) return
        // Usamos el hook, no llamamos al servicio directamente
        await deleteMutation.mutateAsync(id);
    }

    const handleToggleActive = async (shoe: Shoe) => {
        // Usamos la mutación manual que definimos arriba
        await toggleMutation.mutateAsync(shoe);
    }

    const handleSubmit = async (formData: ShoeCreateRequest) => {
        try {
            if (editingShoe) {
                // MODO EDICIÓN
                // TypeScript necesita que convirtamos el formData a ShoeUpdateRequest
                // Como usamos un formulario unificado, pasamos los datos tal cual
                await updateMutation.mutateAsync({
                    id: editingShoe.id,
                    data: formData as unknown as ShoeUpdateRequest // Cast seguro aquí
                });
            } else {
                // MODO CREACIÓN
                await createMutation.mutateAsync(formData);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error al guardar:", err);
            // Aquí podrías poner un toast o notificación de error
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingShoe(null)
    }

    // Filtramos visualmente (aunque podríamos pedir filtrado al backend también)
    const activeShoes = shoes.filter(s => s.active)
    const inactiveShoes = shoes.filter(s => !s.active)

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

            {/* Estado de Carga */}
            {isLoading && <p className="text-gray-500 text-center py-12">Cargando zapatillas...</p>}

            {/* Estado de Error */}
            {isError && (
                <div className="text-red-600 mb-4 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                    Error al cargar: {error?.message}
                </div>
            )}

            {/* Estado Vacío */}
            {!isLoading && !isError && shoes.length === 0 && (
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

            {/* LISTA DE ZAPATILLAS */}
            {!isLoading && !isError && shoes.length > 0 && (
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

            {/* Modal de Formulario */}
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