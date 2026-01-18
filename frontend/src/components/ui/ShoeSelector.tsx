import { Footprints, Plus, CheckCircle2, type LucideIcon, AlertCircle } from 'lucide-react'
import type { ShoeSummaryResponse } from '../../types/shoe' // Tu tipo actualizado
import type { ColorVariant } from '../../types/ui'

type ShoeSelectorProps = {
    shoes: ShoeSummaryResponse[]
    selectedShoeId: number | null
    onSelectShoe: (shoeId: number | null) => void
    onAddShoe?: () => void
    color?: ColorVariant
    icon?: LucideIcon
    label?: string
}

const THEME: Record<ColorVariant, { gradient: string; text: string; bar: string }> = {
    green: { gradient: 'from-green-500 to-green-600', text: 'text-green-700', bar: 'bg-green-500' },
    blue: { gradient: 'from-blue-500 to-blue-600', text: 'text-blue-700', bar: 'bg-blue-500' },
    purple: { gradient: 'from-purple-500 to-purple-600', text: 'text-purple-700', bar: 'bg-purple-500' },
    hyrox: { gradient: 'from-yellow-400 to-yellow-500', text: 'text-yellow-800', bar: 'bg-yellow-500' }
}

export default function ShoeSelector({
    shoes,
    selectedShoeId,
    onSelectShoe,
    onAddShoe,
    color = 'green',
    icon: Icon = Footprints,
    label = 'Zapatillas'
}: ShoeSelectorProps) {

    const styles = THEME[color]

    // Función segura para calcular progreso
    const getProgressStats = (current: number, max: number | null) => {
        // Si no hay máximo definido en backend, asumimos 800km (estándar running)
        const safeMax = max || 800000
        const percentage = Math.min((current / safeMax) * 100, 100)

        let progressColor = styles.bar
        if (percentage > 100) progressColor = 'bg-red-500'
        else if (percentage > 90) progressColor = 'bg-orange-500'

        return { percentage, progressColor }
    }

    if (shoes.length === 0) {
        // Estado vacío simple
        return (
            <div className="p-4 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 m-4">
                <Icon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-sm font-medium">No hay zapatillas</span>
                {onAddShoe && (
                    <button onClick={onAddShoe} className="mt-2 text-xs text-blue-600 font-bold hover:underline">
                        Añadir ahora
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="py-4 select-none">
            {/* Header */}
            <div className="px-5 flex items-center justify-between text-gray-400 mb-3">
                <div className="flex items-center">
                    <Icon className={`w-4 h-4 mr-2 ${selectedShoeId ? styles.text : ''}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                </div>
            </div>

            {/* Scroll Container */}
            <div className="flex gap-3 overflow-x-auto pb-6 px-5 scrollbar-hide snap-x">
                {shoes.map((shoe) => {
                    const isSelected = shoe.id === selectedShoeId
                    // Usamos tus campos de shoe.ts
                    const hasImage = !!shoe.image
                    const distanceMeters = shoe.totalDistanceMeters || 0

                    const { percentage, progressColor } = getProgressStats(distanceMeters, shoe.maxDistanceMeters)
                    const distanceKm = Math.round(distanceMeters / 1000)

                    return (
                        <button
                            key={shoe.id}
                            type="button"
                            onClick={() => onSelectShoe(isSelected ? null : shoe.id)}
                            className={`
                                relative flex-shrink-0 w-40 h-48 rounded-2xl overflow-hidden text-left transition-all duration-300 snap-start shadow-sm group
                                ${isSelected
                                    ? 'ring-2 ring-offset-2 ring-gray-900 shadow-md translate-y-[-2px]'
                                    : 'border border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            {/* IMAGEN O GRADIENTE */}
                            {hasImage ? (
                                <>
                                    <img
                                        src={shoe.image!}
                                        alt={shoe.model}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent ${isSelected ? 'opacity-90' : 'opacity-70'}`} />
                                </>
                            ) : (
                                <div className={`absolute inset-0 bg-gradient-to-br ${isSelected ? styles.gradient : 'from-gray-50 to-gray-100'}`}>
                                    <span className={`absolute top-2 right-2 text-5xl font-black opacity-10 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                        {shoe.brand.slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                            )}

                            {/* CHECK SELECCIÓN */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 animate-in zoom-in duration-300 z-20">
                                    <div className="bg-white text-black rounded-full p-0.5">
                                        <CheckCircle2 className="w-5 h-5 fill-current" />
                                    </div>
                                </div>
                            )}

                            {/* DATOS */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 z-10 w-full">
                                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${hasImage || isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                                    {shoe.brand}
                                </span>

                                <span className={`text-sm font-bold leading-tight block line-clamp-2 mb-3 ${hasImage || isSelected ? 'text-white' : 'text-gray-900'}`}>
                                    {shoe.nickname || shoe.model}
                                </span>

                                {/* BARRA DE DESGASTE */}
                                <div className="w-full">
                                    <div className="flex justify-between text-[10px] font-medium mb-1 opacity-90">
                                        <span className={hasImage || isSelected ? 'text-white' : 'text-gray-600'}>
                                            {distanceKm}km
                                        </span>
                                        {percentage > 90 && (
                                            <AlertCircle className="w-3 h-3 text-red-500 animate-pulse" />
                                        )}
                                    </div>

                                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${hasImage || isSelected ? 'bg-white/20' : 'bg-gray-200'}`}>
                                        <div
                                            style={{ width: `${percentage}%` }}
                                            className={`h-full rounded-full transition-all duration-500 ${hasImage ? (percentage > 90 ? 'bg-red-500' : 'bg-white') : progressColor}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </button>
                    )
                })}

                {/* BOTÓN AÑADIR */}
                {onAddShoe && (
                    <button
                        type="button"
                        onClick={onAddShoe}
                        className="flex-shrink-0 w-20 h-48 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300 transition-all snap-start"
                    >
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                            <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold">Nueva</span>
                    </button>
                )}
            </div>
        </div>
    )
}