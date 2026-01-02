// src/components/shoes/ShoeCard.tsx
import { Pencil, Trash2, Gauge, AlertTriangle } from 'lucide-react'
import type { ShoeResponse } from '../../types/shoe'

type ShoeCardProps = {
    shoe: ShoeResponse
    onEdit: (shoe: ShoeResponse) => void
    onDelete: (id: number) => void
}

function ShoeCard({ shoe, onEdit, onDelete }: ShoeCardProps) {
    // Convertir a Km para visualizar
    const currentKm = Math.round(shoe.currentDistanceMeters / 1000)
    const maxKm = shoe.maxDistanceMeters ? Math.round(shoe.maxDistanceMeters / 1000) : null

    // Calcular color de la barra según desgaste
    const percentage = (shoe.usagePercentage || 0) * 100
    let progressColor = 'bg-green-500'
    if (percentage > 75) progressColor = 'bg-yellow-500'
    if (percentage > 90) progressColor = 'bg-red-500'

    return (
        <div className= {`bg-white p-4 rounded-xl shadow-sm border-l-4 ${shoe.isActive ? 'border-green-500' : 'border-gray-300 opacity-75'}`
}>
    <div className="flex justify-between items-start mb-3" >
        <div>
        <h3 className="font-bold text-gray-800 text-lg" >
            { shoe.nickname ? `"${shoe.nickname}"` : shoe.name }
            </h3>
            < p className = "text-sm text-gray-500" > { shoe.brand } { shoe.nickname ? `(${shoe.name})` : '' } </p>
                </div>
                < div className = "flex space-x-2" >
                    <button onClick={ () => onEdit(shoe) } className = "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" >
                        <Pencil className="w-4 h-4" />
                            </button>
                            < button onClick = {() => onDelete(shoe.id)} className = "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" >
                                <Trash2 className="w-4 h-4" />
                                    </button>
                                    </div>
                                    </div>

{/* Barra de Progreso / Kilometraje */ }
<div className="mt-2" >
    <div className="flex justify-between text-xs font-medium text-gray-600 mb-1" >
        <span className="flex items-center" >
            <Gauge className="w-3 h-3 mr-1" />
                { currentKm } km
                    </span>
{ maxKm && <span>Meta: { maxKm } km </span> }
</div>

{
    maxKm && (
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden" >
            <div 
                            className={ `h-2.5 rounded-full transition-all duration-500 ${progressColor}` }
    style = {{ width: `${Math.min(percentage, 100)}%` }
}
                        > </div>
    </div>
                )}

{/* Aviso si está "quemada" */ }
{
    percentage >= 100 && (
        <div className="mt-2 flex items-center text-xs text-red-600 font-bold" >
            <AlertTriangle className="w-3 h-3 mr-1" />
                Vida útil excedida
                    </div>
                )
}
</div>

{
    !shoe.isActive && (
        <div className="mt-2 inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded border border-gray-200" >
            Retirada
            </div>
            )
}
</div>
    )
}

export default ShoeCard