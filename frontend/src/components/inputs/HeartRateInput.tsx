import { useMemo } from 'react'
import { Heart, type LucideIcon } from 'lucide-react'
import type { ColorVariant } from '../../types/ui'

/* =========================
   Types
========================= */

/**
 * Props del componente {@link HeartRateInput}.
 */
type HeartRateInputProps = {
    /**
     * Frecuencia cardíaca en bpm.
     *
     * - `null` representa “sin dato / no aplica”.
     * - Cuando es `number`, se interpreta como bpm enteros.
     */
    value: number | null

    /**
     * Callback cuando cambia el valor.
     *
     * @param val bpm enteros o `null` si el input queda vacío.
     */
    onChange: (val: number | null) => void

    /**
     * Límite inferior usado para posicionar el indicador en la barra.
     * No clampa el valor emitido, solo afecta a la visualización.
     * @default 40
     */
    min?: number

    /**
     * Límite superior usado para posicionar el indicador en la barra.
     * No clampa el valor emitido, solo afecta a la visualización.
     * @default 200
     */
    max?: number

    /**
     * Etiqueta mostrada en el header del card.
     * @default 'Frecuencia Cardíaca'
     */
    label?: string

    /**
     * Variante visual (color del icono y borde en foco del input).
     *
     * Se restringe a {@link TimeColorVariant} para reutilizar el catálogo existente.
     * @default 'green'
     */
    color?: ColorVariant

    /**
     * Icono del header.
     *
     * Debe ser un componente Lucide (tipo {@link LucideIcon}).
     * @default Heart
     */
    icon?: LucideIcon

    /**
     * Placeholder del input cuando `value` es `null`.
     * @default '145'
     */
    placeholder?: string
}

/* =========================
   Theme
========================= */

/**
 * Mapa de estilos por variante.
 *
 * Importante: clases Tailwind explícitas para asegurar inclusión en build-time.
 */
const THEME: Record<ColorVariant, { focusBorder: string; icon: string }> = {
    green: { focusBorder: 'focus:border-green-500', icon: 'text-green-500' },
    blue: { focusBorder: 'focus:border-blue-500', icon: 'text-blue-500' },
    purple: { focusBorder: 'focus:border-purple-500', icon: 'text-purple-500' },
    hyrox: { focusBorder: 'focus:border-yellow-500', icon: 'text-yellow-600' },
}

/* =========================
   Component
========================= */

/**
 * Input de frecuencia cardíaca (bpm) en formato card.
 *
 * Características:
 * - Permite `null` para representar ausencia de dato.
 * - Input numérico centrado con estilo mobile-friendly.
 * - Indicador visual sobre una barra de “zonas” (Z1..Z5) basado en `min/max`.
 *
 * Contrato:
 * - `value` usa `number | null`
 * - `onChange` emite `null` si el input queda vacío, o bpm enteros (>= 0) si hay valor.
 *
 * Nota:
 * - `min` y `max` se usan para el posicionamiento del indicador y se clampa
 *   únicamente para esa visualización.
 */
export default function HeartRateInput({
    value,
    onChange,
    min = 40,
    max = 200,
    label = 'Frecuencia Cardíaca',
    color = 'green',
    icon: Icon = Heart,
    placeholder = '145',
}: HeartRateInputProps) {
    const theme = THEME[color]

    /**
     * Posición del indicador (0..100) sobre la barra, calculada a partir de `value`,
     * con clamp al rango [min..max].
     */
    const positionPercent = useMemo(() => {
        if (value == null) return 0
        if (max <= min) return 0
        const clamped = Math.min(Math.max(value, min), max)
        return ((clamped - min) / (max - min)) * 100
    }, [value, min, max])

    /**
     * Normaliza el input:
     * - String vacío → `null`
     * - Valor no numérico → no emite cambios
     * - Numérico → redondea a entero y fuerza mínimo 0
     */
    const handleChange = (raw: string) => {
        if (!raw) {
            onChange(null)
            return
        }

        const n = Number(raw)
        if (!Number.isFinite(n)) return

        const bpm = Math.round(n)
        onChange(Math.max(0, bpm))
    }

    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col justify-center h-full transition-all hover:border-gray-200">
            <div className="flex items-center text-gray-400 mb-3">
                <Icon className={`w-4 h-4 mr-2 ${value != null ? theme.icon : ''}`} aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            </div>

            <div className="flex items-baseline justify-center mb-4">
                <input
                    type="number"
                    inputMode="numeric"
                    value={value ?? ''}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-24 text-center bg-gray-50 text-2xl font-bold text-gray-900 rounded-xl border-2 border-gray-100 focus:outline-none focus:bg-white transition-colors p-2 ${theme.focusBorder}`}
                    aria-label={label}
                />
                <span className="text-sm font-medium text-gray-400 ml-2">bpm</span>
            </div>

            <div className="relative pt-2 pb-1 px-1">
                {/* Barra de referencia (zonas) */}
                <div className="h-2 rounded-full bg-gradient-to-r from-sky-300 via-green-400 via-yellow-400 to-red-500" />

                {/* Indicador sólo cuando hay valor */}
                {value != null && (
                    <div
                        className="absolute top-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gray-800 transition-all duration-500 ease-out"
                        style={{ left: `calc(${positionPercent}% - 6px)` }}
                        aria-hidden="true"
                    />
                )}

                {/* Etiquetas de zonas */}
                <div className="flex justify-between mt-1.5 text-[9px] font-semibold text-gray-300 uppercase tracking-wide select-none">
                    <span>Z1</span>
                    <span>Z2</span>
                    <span>Z3</span>
                    <span>Z4</span>
                    <span>Z5</span>
                </div>
            </div>
        </div>
    )
}
