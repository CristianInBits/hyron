import { Footprints, Pencil, Trash2, Power } from 'lucide-react'
import type { ShoeResponse } from '../../types/shoe'

type ShoeCardProps = {
    shoe: ShoeResponse
    onEdit: (shoe: ShoeResponse) => void
    onDelete: (id: number) => void
    onToggleActive: (shoe: ShoeResponse) => void
}

function ShoeCard({ shoe, onEdit, onDelete, onToggleActive }: ShoeCardProps) {
    const formatDistance = (meters: number | null) => {
        if (meters === null) return '-'
        return `${(meters / 1000).toFixed(1)} km`
    }

    const getProgressColor = (percentage: number | null) => {
        if (percentage === null) return 'bg-gray-200'
        if (percentage >= 100) return 'bg-red-500'
        if (percentage >= 80) return 'bg-orange-500'
        return 'bg-green-500'
    }

    return (
        <div className={`bg-white p-4 rounded-xl shadow-sm transition-all ${!shoe.active ? 'opacity-60 bg-gray-50' : 'border-l-4 border-green-500'}`}>
            <div className="flex items-start justify-between">
                {/* Info principal */}
                <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${shoe.active ? 'bg-gray-100' : 'bg-gray-200'}`}>
                        <Footprints className={`w-6 h-6 ${shoe.active ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                        <div className="flex items-center">
                            <p className="font-medium text-gray-800">
                                {shoe.brand} {shoe.model}
                            </p>
                            {!shoe.active && (
                                <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                    Retirada
                                </span>
                            )}
                        </div>
                        {shoe.nickname && (
                            <p className="text-sm text-gray-500">"{shoe.nickname}"</p>
                        )}
                        <p className="text-sm text-gray-400 mt-1">
                            {formatDistance(shoe.totalDistanceMeters)} recorridos
                        </p>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex space-x-1">
                    <button
                        className={`p-2 rounded ${shoe.active
                            ? 'text-green-500 hover:text-green-700 hover:bg-green-50'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                        onClick={() => onToggleActive(shoe)}
                        title={shoe.active ? 'Retirar zapatilla' : 'Reactivar zapatilla'}
                    >
                        <Power className="w-5 h-5" />
                    </button>
                    <button
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        onClick={() => onEdit(shoe)}
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    <button
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        onClick={() => onDelete(shoe.id)}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Barra de progreso (solo si hay máximo definido y está activa) */}
            {shoe.maxDistanceMeters && shoe.active && (
                <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{shoe.percentageUsed ?? 0}% usado</span>
                        <span>Máx: {formatDistance(shoe.maxDistanceMeters)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${getProgressColor(shoe.percentageUsed)} transition-all`}
                            style={{ width: `${Math.min(shoe.percentageUsed ?? 0, 100)}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShoeCard