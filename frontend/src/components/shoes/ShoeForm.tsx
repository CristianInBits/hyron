import { useState, useEffect } from 'react'
import { getErrorMessage } from '../../services/errorHandler'
import type { ShoeResponse, ShoeCreateRequest } from '../../types/shoe'

type ShoeFormProps = {
    shoe?: ShoeResponse | null
    onSubmit: (data: ShoeCreateRequest) => Promise<void>
    onCancel: () => void
}

function ShoeForm({ shoe, onSubmit, onCancel }: ShoeFormProps) {
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [nickname, setNickname] = useState('')
    const [initialDistanceKm, setInitialDistanceKm] = useState('')
    const [maxDistanceKm, setMaxDistanceKm] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (shoe) {
            setBrand(shoe.brand)
            setModel(shoe.model)
            setNickname(shoe.nickname || '')
            setInitialDistanceKm(shoe.initialDistanceMeters ? (shoe.initialDistanceMeters / 1000).toString() : '')
            setMaxDistanceKm(shoe.maxDistanceMeters ? (shoe.maxDistanceMeters / 1000).toString() : '')
        } else {
            setBrand('')
            setModel('')
            setNickname('')
            setInitialDistanceKm('')
            setMaxDistanceKm('')
        }
    }, [shoe])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!brand.trim()) {
            setError('La marca es obligatoria')
            return
        }
        if (!model.trim()) {
            setError('El modelo es obligatorio')
            return
        }

        try {
            setLoading(true)
            setError(null)
            await onSubmit({
                brand: brand.trim(),
                model: model.trim(),
                nickname: nickname.trim() || null,
                initialDistanceMeters: initialDistanceKm ? Math.round(parseFloat(initialDistanceKm) * 1000) : undefined,
                maxDistanceMeters: maxDistanceKm ? Math.round(parseFloat(maxDistanceKm) * 1000) : null,
            })
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
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Marca y Modelo */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marca *
                    </label>
                    <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Nike"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Modelo *
                    </label>
                    <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Pegasus 40"
                    />
                </div>
            </div>

            {/* Nickname */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apodo (opcional)
                </label>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Las verdes"
                />
            </div>

            {/* Distancias */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Km iniciales
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={initialDistanceKm}
                        onChange={(e) => setInitialDistanceKm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="0"
                    />
                    <p className="text-xs text-gray-400 mt-1">Si ya tenían uso previo</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Km máximos
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={maxDistanceKm}
                        onChange={(e) => setMaxDistanceKm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="800"
                    />
                    <p className="text-xs text-gray-400 mt-1">Para aviso de desgaste</p>
                </div>
            </div>

            {/* Botones */}
            <div className="flex space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    )
}

export default ShoeForm