import { Footprints, Pencil, Trash2, Power, RotateCcw } from 'lucide-react'
import type { Shoe, ShoeStatus, ShoeType } from '../../types/shoe'
import { useSettings } from '../../context/SettingsContext'

type ShoeCardProps = {
    shoe: Shoe
    onEdit: (shoe: Shoe) => void
    onDelete: (id: number) => void
    onToggleActive: (shoe: Shoe) => void
}

function ShoeCard({ shoe, onEdit, onDelete, onToggleActive }: ShoeCardProps) {

    const { formatDistance } = useSettings()
    const percentage = shoe.usagePercent ?? 0;

    // COLORES DE ESTADO (Semánticos siempre que sea posible)
    const getStatusColor = (status: ShoeStatus) => {
        switch (status) {
            case 'OK': return 'bg-emerald-500'; // Verde siempre se ve bien
            case 'WARNING': return 'bg-amber-500';
            case 'OVERDUE': return 'bg-rose-500';
            default: return 'bg-muted';
        }
    }

    // ETIQUETAS DE TIPO
    // Adaptadas para que se vean bien en ambos modos usando opacidad en oscuro
    const getTypeStyle = (type: ShoeType) => {
        switch (type) {
            case 'RUNNING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200';
            case 'TRAIL': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200';
            case 'HYROX': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200';
            case 'CROSSFIT': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200';
            case 'WALKING': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-300';
        }
    }

    return (
        <div
            className={`group relative rounded-xl shadow-sm border overflow-hidden transition-all duration-300
            bg-surface
            border-border
            ${shoe.active
                    ? 'hover:shadow-md hover:border-brand' // Hover toma el color de marca (verde por defecto)
                    : 'opacity-75 bg-page border-border' // Retirada se funde con el fondo
                }`}
        >
            {/* Contenedor flexible que mantiene altura fija */}
            <div className="flex flex-row h-32">

                {/* 1. IMAGEN */}
                <div className="relative w-24 sm:w-32 flex-shrink-0 bg-page flex items-center justify-center overflow-hidden border-r border-border">
                    {shoe.imageUrl ? (
                        <img
                            src={shoe.imageUrl}
                            alt={shoe.model}
                            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 
                                ${!shoe.active ? 'grayscale' : ''}`}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-muted">
                            <Footprints className="w-8 h-8 sm:w-10 sm:h-10 mb-1" />
                        </div>
                    )}

                    {!shoe.active && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px]">
                            <span className="bg-surface/90 text-main text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wide">
                                <span className="sm:hidden">Ret</span>
                                <span className="hidden sm:inline">Retirada</span>
                            </span>
                        </div>
                    )}
                </div>

                {/* 2. CONTENIDO */}
                <div className="flex-1 p-2 sm:p-4 flex flex-col justify-between min-w-0">
                    <div>
                        <div className="flex items-start justify-between mb-1 gap-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border border-transparent uppercase tracking-wider inline-block truncate ${getTypeStyle(shoe.type)}`}>
                                {shoe.type}
                            </span>
                            {shoe.status === 'OVERDUE' && shoe.active && (
                                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-800 uppercase shrink-0">
                                    Agotada
                                </span>
                            )}
                        </div>

                        <h3 className="text-sm sm:text-lg font-bold text-main leading-tight truncate">
                            {shoe.nickname || shoe.model}
                        </h3>

                        <p className="text-xs sm:text-sm text-muted font-medium truncate">
                            {shoe.brand} {shoe.nickname ? shoe.model : ''}
                        </p>
                    </div>

                    {/* Barra de Progreso */}
                    <div className="mt-auto pt-2">
                        {shoe.maxDistanceMeters && shoe.maxDistanceMeters > 0 ? (
                            <>
                                <div className="flex justify-between text-[10px] sm:text-xs text-muted mb-1 font-medium">
                                    <span className={shoe.status === 'OVERDUE' ? 'text-rose-500 font-bold' : ''}>
                                        {formatDistance(shoe.totalDistanceMeters)}
                                        <span className="opacity-50 mx-1">/</span>
                                        {formatDistance(shoe.maxDistanceMeters)}
                                    </span>
                                    <span className="text-muted/70 hidden sm:inline">{percentage}%</span>
                                </div>
                                <div className="h-1.5 sm:h-2 w-full bg-page rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getStatusColor(shoe.status)} transition-all duration-500 rounded-full`}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center text-[10px] sm:text-xs text-muted font-medium bg-page p-1 sm:p-2 rounded border border-border truncate">
                                <span className="mr-1 sm:mr-2">♾️</span>
                                <span className="truncate">Total: {formatDistance(shoe.totalDistanceMeters)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. ACCIONES */}
                <div className="flex flex-col justify-center border-l border-border bg-page/30 p-1 sm:p-2 space-y-1 sm:space-y-2 w-10 sm:w-auto items-center">
                    <button
                        className="p-1.5 sm:p-2 rounded-lg transition-colors text-muted hover:text-brand hover:bg-surface border border-transparent hover:border-border hover:shadow-sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleActive(shoe)
                        }}
                    >
                        {shoe.active ? <Power className="w-4 h-4 sm:w-5 sm:h-5" /> : <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>

                    <button
                        className="p-1.5 sm:p-2 text-muted hover:text-blue-500 hover:bg-surface border border-transparent hover:border-border hover:shadow-sm rounded-lg transition-colors"
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit(shoe)
                        }}
                    >
                        <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <button
                        className="p-1.5 sm:p-2 text-muted hover:text-rose-500 hover:bg-surface border border-transparent hover:border-border hover:shadow-sm rounded-lg transition-colors"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete(shoe.id)
                        }}
                    >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ShoeCard