import { Footprints, Plus, CheckCircle2, type LucideIcon, AlertCircle } from 'lucide-react'
import type { ShoeSummaryResponse } from '../../types/shoe'
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

// Definición expandida del tema para controlar todos los estados
type ThemeStyles = {
    gradient: string
    text: string
    ring: string
    check: string      // Color del icono de check
    addBorder: string  // Color del borde hover en botón añadir
    addText: string    // Color del texto hover en botón añadir
}

const THEME: Record<ColorVariant, ThemeStyles> = {
    green: {
        gradient: 'from-emerald-500 to-green-600',
        text: 'text-emerald-700',
        ring: 'ring-emerald-500',
        check: 'text-emerald-600',
        addBorder: 'hover:border-emerald-400',
        addText: 'hover:text-emerald-600'
    },
    blue: {
        gradient: 'from-blue-500 to-indigo-600',
        text: 'text-blue-700',
        ring: 'ring-blue-500',
        check: 'text-blue-600',
        addBorder: 'hover:border-blue-400',
        addText: 'hover:text-blue-600'
    },
    purple: {
        gradient: 'from-violet-500 to-purple-600',
        text: 'text-purple-700',
        ring: 'ring-purple-500',
        check: 'text-purple-600',
        addBorder: 'hover:border-purple-400',
        addText: 'hover:text-purple-600'
    },
    hyrox: {
        gradient: 'from-yellow-400 to-orange-500',
        text: 'text-yellow-800',
        ring: 'ring-yellow-500',
        check: 'text-orange-600', // Orange se lee mejor que yellow en iconos
        addBorder: 'hover:border-yellow-500',
        addText: 'hover:text-yellow-700'
    }
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

    // Cálculo de estadísticas
    const getShoeStats = (distance: number, max: number | null) => {
        const safeMax = max || 800000
        const percentage = Math.min((distance / safeMax) * 100, 100)

        let statusColor = styles.gradient // Usamos el gradiente del tema por defecto

        if (percentage >= 100) statusColor = 'bg-red-500'
        else if (percentage > 90) statusColor = 'bg-orange-500'
        else statusColor = 'bg-white'

        return { percentage, statusColor }
    }

    // Estado vacío
    if (shoes.length === 0) {
        return (
            <div className="px-4 py-2">
                <div className="flex items-center text-gray-400 mb-3">
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                </div>
                <button
                    onClick={onAddShoe}
                    className={`w-full py-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 ${styles.addBorder} ${styles.addText} transition-all bg-gray-50/50 group`}
                >
                    <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium">Añadir {label.toLowerCase()}</span>
                </button>
            </div>
        )
    }

    return (
        <div className="py-4 select-none">
            <div className="px-4 flex items-center text-gray-400 mb-3">
                <Icon className={`w-4 h-4 mr-2 ${selectedShoeId ? styles.text : ''}`} />
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pt-4 pb-6 px-4 scrollbar-hide snap-x">
                {shoes.map((shoe) => {
                    const isSelected = shoe.id === selectedShoeId
                    const distanceMeters = shoe.totalDistanceMeters || 0
                    const distanceKm = Math.round(distanceMeters / 1000)
                    const { percentage, statusColor } = getShoeStats(distanceMeters, shoe.maxDistanceMeters)

                    return (
                        <button
                            key={shoe.id}
                            type="button"
                            onClick={() => onSelectShoe(isSelected ? null : shoe.id)}
                            className={`
                                relative flex-shrink-0 w-36 h-48 rounded-2xl overflow-hidden text-left transition-all duration-300 snap-start group shadow-sm
                                ${isSelected
                                    ? `ring-[3px] ring-offset-2 ${styles.ring} shadow-lg scale-[1.02]`
                                    : 'border border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            {/* IMAGEN / FONDO */}
                            {shoe.image ? (
                                <>
                                    <img
                                        src={shoe.image}
                                        alt={shoe.model}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                </>
                            ) : (
                                <div className={`absolute inset-0 bg-gradient-to-br ${isSelected ? styles.gradient : 'from-slate-100 to-slate-200'}`}>
                                    <span className={`absolute -top-2 -right-2 text-6xl font-black opacity-10 select-none ${isSelected ? 'text-white' : 'text-black'}`}>
                                        {shoe.brand.slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                            )}

                            {/* INDICADOR DE SELECCIÓN */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 z-20 animate-in zoom-in duration-200">
                                    <div className="bg-white text-black rounded-full p-1 shadow-sm">
                                        {/* AHORA USA EL COLOR DEL TEMA */}
                                        <CheckCircle2 className={`w-4 h-4 fill-current ${styles.check}`} />
                                    </div>
                                </div>
                            )}

                            {/* CONTENIDO */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 z-10 w-full">
                                <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-90 ${shoe.image || isSelected ? 'text-white' : 'text-gray-500'}`}>
                                    {shoe.brand}
                                </p>

                                <h4 className={`text-sm font-bold leading-tight line-clamp-2 mb-2 drop-shadow-sm ${shoe.image || isSelected ? 'text-white' : 'text-gray-900'}`}>
                                    {shoe.nickname || shoe.model}
                                </h4>

                                <div className="space-y-1">
                                    <div className={`flex justify-between text-[10px] font-medium ${shoe.image || isSelected ? 'text-gray-200' : 'text-gray-500'}`}>
                                        <span>{distanceKm}km</span>
                                        {percentage > 90 && (
                                            <AlertCircle className="w-3 h-3 text-red-500 fill-red-500/20" />
                                        )}
                                    </div>

                                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${shoe.image || isSelected ? 'bg-white/20' : 'bg-gray-200'}`}>
                                        <div
                                            style={{ width: `${percentage}%` }}
                                            className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
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
                        // AHORA USA ESTILOS DINÁMICOS EN HOVER
                        className={`
                            relative flex-shrink-0 w-36 h-48 rounded-2xl border-2 border-dashed border-gray-200 
                            flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 
                            hover:bg-white ${styles.addBorder} ${styles.addText} 
                            transition-all snap-start group
                        `}
                    >
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold">Añadir par</span>
                    </button>
                )}
            </div>
        </div>
    )
}