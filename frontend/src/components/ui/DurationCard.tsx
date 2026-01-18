import { useState } from 'react'
import { Clock, ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react'
import TimeRoller from './TimeRoller'
import type { ColorVariant } from '../../types/ui'

/* =========================
   Types
========================= */

/**
 * Formatos de duración soportados por {@link DurationCard}.
 *
 * Debe ser compatible con el formato aceptado por {@link TimeRoller}.
 */
type TimeFormat = 'hh:mm:ss' | 'hh:mm' | 'mm:ss' | 'ss'

/**
 * Props del componente {@link DurationCard}.
 */
type DurationCardProps = {
    /**
     * Duración controlada en segundos totales.
     */
    value: number

    /**
     * Callback cuando cambia la duración seleccionada.
     *
     * @param seconds Duración total en segundos.
     */
    onChange: (seconds: number) => void

    /**
     * Formato de visualización y edición.
     *
     * Afecta a:
     * - cómo se muestra el valor en el summary
     * - qué columnas aparecen en el {@link TimeRoller}
     *
     * @default 'hh:mm'
     */
    format?: TimeFormat

    /**
     * Variante visual (bordes/ring/iconos/botón).
     *
     * Se restringe a {@link TimeColorVariant} para garantizar consistencia con {@link THEME}.
     * @default 'green'
     */
    color?: ColorVariant

    /**
     * Etiqueta de la tarjeta (encima del valor).
     * @default 'Tiempo'
     */
    label?: string

    /**
     * Icono principal del header.
     *
     * Debe ser un componente Lucide (tipo {@link LucideIcon}).
     * @default Clock
     */
    icon?: LucideIcon
}

/* =========================
   Theme
========================= */

/**
 * Mapa de estilos por variante.
 *
 * Importante: clases Tailwind explícitas para asegurar inclusión en build-time.
 */
const THEME: Record<
    ColorVariant,
    {
        /** Borde cuando la tarjeta está expandida. */
        activeBorder: string
        /** Ring (halo) cuando la tarjeta está expandida. */
        activeRing: string
        /** Color del icono cuando está expandida. */
        iconColor: string
        /** Fondo del botón “Confirmar”. */
        btnBg: string
        /** Color de texto del botón “Confirmar”. */
        btnText: string
    }
> = {
    green: {
        activeBorder: 'border-green-500',
        activeRing: 'ring-green-100',
        iconColor: 'text-green-500',
        btnBg: 'bg-green-50',
        btnText: 'text-green-700',
    },
    blue: {
        activeBorder: 'border-blue-500',
        activeRing: 'ring-blue-100',
        iconColor: 'text-blue-500',
        btnBg: 'bg-blue-50',
        btnText: 'text-blue-700',
    },
    purple: {
        activeBorder: 'border-purple-500',
        activeRing: 'ring-purple-100',
        iconColor: 'text-purple-500',
        btnBg: 'bg-purple-50',
        btnText: 'text-purple-700',
    },
    hyrox: {
        activeBorder: 'border-yellow-400',
        activeRing: 'ring-yellow-100',
        iconColor: 'text-yellow-500',
        btnBg: 'bg-yellow-50',
        btnText: 'text-slate-900',
    },
}

/* =========================
   Helpers
========================= */

/**
 * Formatea una duración (segundos) a un string legible según el formato.
 *
 * @param totalSeconds Duración total en segundos.
 * @param format Formato deseado.
 * @returns Texto para mostrar en el summary (ej. "1h 30m", "12m 5s", "45s").
 */
const formatDisplay = (totalSeconds: number, format: TimeFormat) => {
    const safe = Math.max(0, totalSeconds)

    if (format === 'ss') return `${safe}s`

    const h = Math.floor(safe / 3600)
    const m = Math.floor((safe % 3600) / 60)
    const s = safe % 60

    if (format === 'hh:mm:ss') return `${h}h ${m}m ${s}s`
    if (format === 'hh:mm') return h > 0 ? `${h}h ${m}m` : `${m}m`

    if (format === 'mm:ss') {
        const totalM = Math.floor(safe / 60)
        return `${totalM}m ${s}s`
    }

    return `${safe}s`
}

/* =========================
   Component
========================= */

/**
 * Tarjeta colapsable para seleccionar una duración en segundos.
 *
 * Estructura:
 * - Header clickable que muestra etiqueta + valor formateado.
 * - Al expandirse, renderiza un {@link TimeRoller} para editar el tiempo.
 * - Botón “Confirmar Tiempo” para cerrar la tarjeta (no modifica el valor; solo cierra).
 *
 * Contrato:
 * - `value` y `onChange` trabajan siempre con segundos totales.
 *
 * Accesibilidad:
 * - El header usa `aria-expanded` para indicar estado colapsado/expandido.
 * - Los iconos llevan `aria-hidden="true"` porque son decorativos.
 */
export default function DurationCard({
    value,
    onChange,
    format = 'hh:mm',
    color = 'green',
    label = 'Tiempo',
    icon: Icon = Clock,
}: DurationCardProps) {
    /**
     * Estado interno de expansión.
     * `true` → muestra el selector (TimeRoller) y el botón de confirmación.
     */
    const [isOpen, setIsOpen] = useState(false)

    /** Estilos derivados de la variante seleccionada. */
    const styles = THEME[color]

    return (
        <div
            className={`
        w-full bg-white rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden
        ${isOpen
                    ? `${styles.activeBorder} shadow-md ring-1 ${styles.activeRing}`
                    : 'border-gray-100 hover:border-gray-200'
                }
      `}
        >
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                aria-expanded={isOpen}
                className="w-full flex flex-col items-start text-left relative z-10"
            >
                <div className="flex items-center text-gray-400 mb-1 w-full justify-between">
                    <div className="flex items-center">
                        <Icon aria-hidden="true" className={`w-4 h-4 mr-2 ${isOpen ? styles.iconColor : ''}`} />
                        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                    </div>

                    {isOpen ? (
                        <ChevronUp aria-hidden="true" className={`w-4 h-4 ${styles.iconColor}`} />
                    ) : (
                        <ChevronDown aria-hidden="true" className="w-4 h-4" />
                    )}
                </div>

                <div className="text-2xl font-bold text-gray-900 mt-1 truncate">
                    {formatDisplay(value, format)}
                </div>
            </button>

            {isOpen && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="h-px bg-gray-100 w-full mb-4" />

                    <TimeRoller value={value} onChange={onChange} format={format} color={color} />

                    <button
                        type="button"
                        onClick={(e) => {
                            // Evita que el click “burbujee” y cause toggles inesperados.
                            e.stopPropagation()
                            setIsOpen(false)
                        }}
                        className={`w-full mt-4 py-3 text-sm font-bold rounded-xl transition-colors ${styles.btnBg} ${styles.btnText}`}
                    >
                        Confirmar Tiempo
                    </button>
                </div>
            )}
        </div>
    )
}