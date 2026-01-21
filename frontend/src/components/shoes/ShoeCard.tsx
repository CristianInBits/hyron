import { useState, useEffect, useRef } from 'react'
import { Footprints, Pencil, Trash2, RotateCcw, MoreVertical, Archive } from 'lucide-react'
import type { Shoe, ShoeStatus, ShoeType } from '../../types/shoe'
import { useSettings } from '../../context/SettingsContext'

// Types
type ShoeCardProps = {
    shoe: Shoe
    onEdit: (shoe: Shoe) => void
    onDelete: (id: number) => void
    onToggleActive: (shoe: Shoe) => void
}

function ShoeCard({ shoe, onEdit, onDelete, onToggleActive }: ShoeCardProps) {
    // Context / derived values
    const { formatDistance } = useSettings()
    const percentage = shoe.usagePercent ?? 0

    // State + refs
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Effects
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Helpers (styles)
    const getStatusColor = (status: ShoeStatus) => {
        switch (status) {
            case 'OK': return 'bg-emerald-500'
            case 'WARNING': return 'bg-amber-500'
            case 'OVERDUE': return 'bg-rose-500'
            default: return 'bg-muted'
        }
    }

    const getTypeStyle = (type: ShoeType) => {
        switch (type) {
            case 'RUNNING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
            case 'TRAIL': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
            case 'HYROX': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200'
            case 'CROSSFIT': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200'
            case 'WALKING': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
            default: return 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-300'
        }
    }

    const getThemeClass = (type: ShoeType) => {
        switch (type) {
            case 'RUNNING': return 'theme-run'
            case 'TRAIL': return 'theme-trail'
            case 'HYROX': return 'theme-hyrox'
            case 'CROSSFIT': return 'theme-crossfit'
            case 'WALKING': return 'theme-walking'
            default: return ''
        }
    }

    // Render / UI
    return (
        <div
            className={`
                ${getThemeClass(shoe.type)}
                group relative rounded-xl shadow-sm border transition-all duration-300
                bg-surface border-border
                ${shoe.active ? 'hover:shadow-md hover:border-brand' : 'opacity-75 bg-page border-border'}
            `}
        >
            <div className="flex flex-row h-32 sm:h-auto">

                {/* UI: Imagen */}
                <div className="relative w-24 sm:w-32 flex-shrink-0 bg-page flex items-center justify-center overflow-hidden border-r border-border rounded-l-xl">
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
                                Retirada
                            </span>
                        </div>
                    )}
                </div>

                {/* UI: Contenido central */}
                <div className="flex-1 p-2 sm:p-4 flex flex-col min-w-0">
                    <div>
                        <div className="flex items-start justify-between mb-1 gap-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border border-transparent uppercase tracking-wider inline-block truncate ${getTypeStyle(shoe.type)}`}>
                                {shoe.type}
                            </span>
                        </div>

                        {shoe.nickname && (
                            <div className="mb-0.5 leading-none">
                                <span className="text-xs italic font-medium text-main opacity-90">"{shoe.nickname}"</span>
                            </div>
                        )}

                        <h3 className="text-sm sm:text-lg font-bold text-main leading-tight truncate mb-1.5">
                            {shoe.model}
                        </h3>

                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs text-muted font-medium uppercase tracking-wide truncate">{shoe.brand}</span>
                        </div>
                    </div>

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

                {/* UI: Zona de acción */}
                <div className="flex flex-col justify-center border-l border-border bg-page/30 w-10 sm:w-12 items-center relative rounded-r-xl">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsMenuOpen(!isMenuOpen)
                        }}
                        className={`p-2 rounded-full transition-colors hover:bg-surface hover:text-brand 
                            ${isMenuOpen ? 'bg-surface text-brand shadow-sm' : 'text-muted'}`}
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* UI: Menú flotante */}
                    {isMenuOpen && (
                        <div
                            ref={menuRef}
                            className="absolute top-10 right-2 z-50 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-1 flex flex-col gap-0.5">
                                <button
                                    onClick={() => { setIsMenuOpen(false); onEdit(shoe) }}
                                    className="w-full text-left px-3 py-2.5 text-sm text-main hover:bg-page rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Pencil className="w-4 h-4 text-muted" />
                                    <span>Editar</span>
                                </button>

                                <button
                                    onClick={() => { setIsMenuOpen(false); onToggleActive(shoe) }}
                                    className={`w-full text-left px-3 py-2.5 text-sm hover:bg-page rounded-lg flex items-center gap-2 transition-colors
                                        ${shoe.active ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                                >
                                    {shoe.active ? <Archive className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                                    <span>{shoe.active ? 'Retirar' : 'Reactivar'}</span>
                                </button>

                                <div className="h-px bg-border my-0.5" />

                                <button
                                    onClick={() => { setIsMenuOpen(false); onDelete(shoe.id) }}
                                    className="w-full text-left px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Borrar</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default ShoeCard