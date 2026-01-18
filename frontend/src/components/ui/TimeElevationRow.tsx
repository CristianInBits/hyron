import { useState } from 'react'
import { Clock, Mountain, ChevronDown, ChevronUp } from 'lucide-react'
import TimeRoller from './TimeRoller'

type TimeElevationRowProps = {
    durationSeconds: number
    onDurationChange: (seconds: number) => void
    elevationMeters: number | null
    onElevationChange: (meters: number | null) => void
}

// Helper simple para formatear el texto del botón
const formatDuration = (totalSeconds: number) => {
    if (!totalSeconds) return '00:00'
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)

    if (h > 0) {
        return `${h}h ${m}m`
    }
    return `${m}m ${totalSeconds % 60}s`
}

export default function TimeElevationRow({
    durationSeconds,
    onDurationChange,
    elevationMeters,
    onElevationChange
}: TimeElevationRowProps) {
    const [isTimeOpen, setIsTimeOpen] = useState(false)

    return (
        <div className="px-4 py-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">

                {/* 1. TARJETA DE TIEMPO (Expandible) */}
                <div
                    className={`
                        bg-white rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden
                        ${isTimeOpen ? 'col-span-2 border-green-500 shadow-md ring-1 ring-green-100' : 'col-span-1 border-gray-100'}
                    `}
                >
                    <button
                        type="button"
                        onClick={() => setIsTimeOpen(!isTimeOpen)}
                        className="w-full flex flex-col items-start text-left z-10 relative"
                    >
                        <div className="flex items-center text-gray-400 mb-1 w-full justify-between">
                            <div className="flex items-center">
                                <Clock className={`w-4 h-4 mr-2 ${isTimeOpen ? 'text-green-500' : ''}`} />
                                <span className="text-xs font-bold uppercase tracking-wider">Tiempo</span>
                            </div>
                            {/* Indicador visual de expansión */}
                            {isTimeOpen ? <ChevronUp className="w-4 h-4 text-green-500" /> : <ChevronDown className="w-4 h-4" />}
                        </div>

                        <div className="text-2xl font-bold text-gray-900 mt-1">
                            {formatDuration(durationSeconds)}
                        </div>
                    </button>

                    {/* El Rodillo (Solo visible si está abierto) */}
                    {isTimeOpen && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="h-px bg-gray-100 w-full mb-4" />
                            <TimeRoller
                                value={durationSeconds}
                                onChange={onDurationChange}
                                format="hh:mm" // O 'hh:mm:ss' si prefieres
                                color="green"
                            />

                            {/* Botón cerrar opcional para UX clara */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsTimeOpen(false)
                                }}
                                className="w-full mt-4 py-2 bg-green-50 text-green-700 text-sm font-bold rounded-xl hover:bg-green-100 transition-colors"
                            >
                                Listo
                            </button>
                        </div>
                    )}
                </div>

                {/* 2. TARJETA DE DESNIVEL (Input simple) */}
                {/* Si el tiempo está abierto, ocultamos o movemos el desnivel para dar foco al rodillo */}
                {!isTimeOpen && (
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col justify-center">
                        <div className="flex items-center text-gray-400 mb-2">
                            <Mountain className="w-4 h-4 mr-2" />
                            <span className="text-xs font-bold uppercase tracking-wider">Desnivel</span>
                        </div>

                        <div className="flex items-baseline">
                            <span className="text-lg font-bold text-green-500 mr-1">+</span>
                            <input
                                type="number"
                                inputMode="numeric"
                                value={elevationMeters ?? ''}
                                onChange={(e) => onElevationChange(e.target.value ? parseInt(e.target.value) : null)}
                                placeholder="0"
                                className="w-full bg-transparent text-2xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none p-0"
                            />
                            <span className="text-sm font-medium text-gray-400 ml-1">m</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Si el tiempo está abierto, mostramos el desnivel debajo para no perderlo */}
            {isTimeOpen && (
                <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center text-gray-400">
                        <Mountain className="w-4 h-4 mr-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">Desnivel Positivo</span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-lg font-bold text-green-500 mr-1">+</span>
                        <input
                            type="number"
                            inputMode="numeric"
                            value={elevationMeters ?? ''}
                            onChange={(e) => onElevationChange(e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="0"
                            className="w-20 text-right bg-transparent text-2xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none p-0"
                        />
                        <span className="text-sm font-medium text-gray-400 ml-1">m</span>
                    </div>
                </div>
            )}
        </div>
    )
}