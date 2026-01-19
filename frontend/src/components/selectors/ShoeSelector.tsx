import { Footprints, Plus, CheckCircle2, type LucideIcon, AlertCircle } from 'lucide-react'
import type { ShoeSummaryResponse } from '../../types/shoe'
import type { ColorVariant } from '../../types/ui'
import { useEffect, useRef, useState } from 'react'

type ShoeSelectorProps = {
    shoes: ShoeSummaryResponse[]
    selectedShoeId: number | null
    onSelectShoe: (shoeId: number | null) => void
    onAddShoe?: () => void
    color?: ColorVariant
    icon?: LucideIcon
    label?: string
}

type ThemeStyles = {
    gradient: string
    bar: string
    text: string
    ring: string
    check: string
    addBorder: string
    addText: string
}

const THEME: Record<ColorVariant, ThemeStyles> = {
    green: {
        gradient: 'from-emerald-500 to-green-600',
        bar: 'bg-emerald-500',
        text: 'text-emerald-700',
        ring: 'ring-emerald-500',
        check: 'text-emerald-600',
        addBorder: 'hover:border-emerald-400',
        addText: 'hover:text-emerald-600'
    },
    blue: {
        gradient: 'from-blue-500 to-indigo-600',
        bar: 'bg-blue-500',
        text: 'text-blue-700',
        ring: 'ring-blue-500',
        check: 'text-blue-600',
        addBorder: 'hover:border-blue-400',
        addText: 'hover:text-blue-600'
    },
    purple: {
        gradient: 'from-violet-500 to-purple-600',
        bar: 'bg-purple-500',
        text: 'text-purple-700',
        ring: 'ring-purple-500',
        check: 'text-purple-600',
        addBorder: 'hover:border-purple-400',
        addText: 'hover:text-purple-600'
    },
    hyrox: {
        gradient: 'from-yellow-400 to-orange-500',
        bar: 'bg-yellow-500',
        text: 'text-yellow-800',
        ring: 'ring-yellow-500',
        check: 'text-orange-600',
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
    const itemsRef = useRef<Map<number, HTMLButtonElement | null>>(new Map())
    const [failedImages, setFailedImages] = useState<Record<number, boolean>>({})

    // Scroll inteligente
    useEffect(() => {
        if (selectedShoeId !== null) {
            const node = itemsRef.current.get(selectedShoeId)
            if (node && node.parentElement) {
                const container = node.parentElement
                const nodeLeft = node.offsetLeft
                const nodeWidth = node.offsetWidth
                const containerWidth = container.offsetWidth
                const targetScroll = nodeLeft - (containerWidth / 2) + (nodeWidth / 2)

                container.scrollTo({ left: targetScroll, behavior: 'smooth' })
            }
        }
    }, [selectedShoeId])

    const handleImageError = (id: number) => {
        setFailedImages(prev => ({ ...prev, [id]: true }))
    }

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

            <div className="flex gap-3 overflow-x-auto pt-4 pb-6 px-4 scrollbar-hide snap-x scroll-pl-4">
                {shoes.map((shoe) => {
                    const isSelected = shoe.id === selectedShoeId
                    const distanceMeters = shoe.totalDistanceMeters || 0
                    const distanceKm = Math.round(distanceMeters / 1000)

                    // Cálculo de porcentaje
                    const max = shoe.maxDistanceMeters || 800000
                    const percentage = Math.min((distanceMeters / max) * 100, 100)
                    const showImage = shoe.image && !failedImages[shoe.id]

                    // --- LÓGICA DE COLOR DE BARRA ---
                    let barColorClass = styles.bar // 3. Base: Color del tema

                    if (percentage > 90) {
                        barColorClass = 'bg-red-500' // 1. Alerta Crítica (Siempre gana)
                    } else if (percentage > 75) {
                        barColorClass = 'bg-orange-500' // 1b. Alerta Media
                    } else if (showImage || isSelected) {
                        barColorClass = 'bg-white'   // 2. Contraste (Solo si no es alerta)
                    }
                    // -------------------------------

                    return (
                        <button
                            key={shoe.id}
                            ref={(el) => {
                                if (el) itemsRef.current.set(shoe.id, el)
                                else itemsRef.current.delete(shoe.id)
                            }}
                            type="button"
                            onClick={() => onSelectShoe(isSelected ? null : shoe.id)}
                            className={`
                                relative flex-shrink-0 w-36 h-48 rounded-2xl overflow-hidden text-left transition-all duration-300 snap-start group shadow-sm
                                ${isSelected
                                    ? `ring-[3px] ring-offset-2 ${styles.ring} shadow-lg scale-[1.02] scroll-m-4`
                                    : 'border border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            {/* IMAGEN / FONDO */}
                            {showImage ? (
                                <>
                                    <img
                                        src={shoe.image!}
                                        alt={shoe.model}
                                        loading="lazy"
                                        onError={() => handleImageError(shoe.id)}
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
                                        <CheckCircle2 className={`w-4 h-4 fill-current ${styles.check}`} />
                                    </div>
                                </div>
                            )}

                            {/* CONTENIDO TEXTO */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 z-10 w-full">
                                <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-90 ${showImage || isSelected ? 'text-white' : 'text-gray-500'}`}>
                                    {shoe.brand}
                                </p>

                                <h4 className={`text-sm font-bold leading-tight line-clamp-2 mb-2 drop-shadow-sm ${showImage || isSelected ? 'text-white' : 'text-gray-900'}`}>
                                    {shoe.nickname || shoe.model}
                                </h4>

                                <div className="space-y-1">
                                    <div className={`flex justify-between text-[10px] font-medium ${showImage || isSelected ? 'text-gray-200' : 'text-gray-500'}`}>
                                        <span>{distanceKm}km</span>
                                        {percentage > 90 && (
                                            <AlertCircle className="w-3 h-3 text-red-500 fill-red-500/20" />
                                        )}
                                    </div>

                                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${showImage || isSelected ? 'bg-white/20' : 'bg-gray-200'}`}>
                                        <div
                                            style={{ width: `${percentage}%` }}
                                            // AQUI USAMOS LA VARIABLE CALCULADA
                                            className={`h-full rounded-full transition-all duration-500 ${barColorClass}`}
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