import { Footprints, Pencil, Trash2, Power, RotateCcw } from 'lucide-react'
import type { Shoe } from '../../types/shoe'

type ShoeCardProps = {
    shoe: Shoe
    onEdit: (shoe: Shoe) => void
    onDelete: (id: number) => void
    onToggleActive: (shoe: Shoe) => void
}

function ShoeCard({ shoe, onEdit, onDelete, onToggleActive }: ShoeCardProps) {

    const formatDistance = (meters: number | null) => {
        if (meters === null) return '0 km'
        return `${(meters / 1000).toFixed(1)} km`
    }

    // Calculamos el porcentaje nosotros si viene nulo, por seguridad
    const percentage = shoe.percentageUsed ??
        (shoe.maxDistanceMeters ? (shoe.totalDistanceMeters * 100) / shoe.maxDistanceMeters : 0)

    const getProgressColor = (pct: number) => {
        if (pct >= 100) return 'bg-red-500'
        if (pct >= 75) return 'bg-orange-500'
        return 'bg-green-500'
    }

    return (
        <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all 
            ${!shoe.active ? 'opacity-75 bg-gray-50' : 'hover:shadow-md'}`}>

            <div className="flex items-start justify-between">
                {/* Info principal */}
                <div className="flex items-start flex-1">
                    <div className={`p-2.5 rounded-lg mr-3 ${shoe.active ? 'bg-green-50 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                        <Footprints className="w-6 h-6" />
                    </div>

                    <div className="w-full mr-4">
                        <div className="flex items-center flex-wrap">
                            <h3 className="font-semibold text-gray-800 text-lg mr-2">
                                {shoe.nickname || `${shoe.brand} ${shoe.model}`}
                            </h3>
                            {!shoe.active && (
                                <span className="text-xs font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded uppercase tracking-wide">
                                    Retirada
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-gray-500 mb-2">
                            {shoe.brand} {shoe.model}
                        </p>

                        {/* Barra de progreso (Visible SIEMPRE si tiene límite, aunque esté inactiva) */}
                        {shoe.maxDistanceMeters ? (
                            <div className="mt-2">
                                <div className="flex justify-between text-xs text-gray-500 mb-1 font-medium">
                                    <span className={percentage >= 100 ? 'text-red-500' : ''}>
                                        {formatDistance(shoe.totalDistanceMeters)}
                                        <span className="font-normal text-gray-400 mx-1">/</span>
                                        {formatDistance(shoe.maxDistanceMeters)}
                                    </span>
                                    <span>{Math.min(percentage, 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getProgressColor(percentage)} transition-all duration-500`}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="mt-2 text-xs text-gray-400 font-medium">
                                Distancia total: {formatDistance(shoe.totalDistanceMeters)} (Sin límite)
                            </div>
                        )}
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1">
                    <button
                        className={`p-2 rounded-lg transition-colors ${shoe.active
                                ? 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                        onClick={() => onToggleActive(shoe)}
                        title={shoe.active ? 'Retirar zapatilla' : 'Reactivar zapatilla'}
                    >
                        {shoe.active ? <Power className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
                    </button>

                    <button
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => onEdit(shoe)}
                        title="Editar"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>

                    <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => onDelete(shoe.id)}
                        title="Eliminar permanentemente"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ShoeCard