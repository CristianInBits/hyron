import { Mountain, type LucideIcon } from 'lucide-react'
import type { ColorVariant } from '../../types/ui'

/* =========================
   Types
========================= */

/**
 * Props del componente {@link ElevationCard}.
 */
type ElevationCardProps = {
    /**
     * Desnivel en metros.
     *
     * - `null` representa “sin dato / no aplica”.
     * - Cuando es `number`, se interpreta como metros enteros.
     */
    value: number | null

    /**
     * Callback cuando cambia el desnivel.
     *
     * @param meters Metros enteros o `null` si el campo queda vacío.
     */
    onChange: (meters: number | null) => void

    /**
     * Variante visual (afecta al color del signo "+" y al hover del contenedor).
     *
     * Se restringe a {@link TimeColorVariant} para reutilizar el catálogo de variantes
     * ya disponible en `types/ui`.
     * @default 'green'
     */
    color?: ColorVariant

    /**
     * Etiqueta mostrada en el header de la tarjeta.
     * @default 'Desnivel'
     */
    label?: string

    /**
     * Icono del header.
     *
     * Debe ser un componente Lucide (tipo {@link LucideIcon}).
     * @default Mountain
     */
    icon?: LucideIcon
}

/* =========================
   Theme
========================= */

/**
 * Mapa de estilos por variante.
 *
 * Se mantiene intencionalmente simple: sólo afecta a:
 * - color del signo "+"
 * - color del borde en hover
 *
 * Nota: se guardan dos clases en un string y luego se separan con `split(' ')`:
 * - índice 0 → color del "+"
 * - índice 1 → clase hover del contenedor
 */
const THEME: Record<ColorVariant, string> = {
    green: 'text-green-500 hover:border-green-200',
    blue: 'text-blue-500 hover:border-blue-200',
    purple: 'text-purple-500 hover:border-purple-200',
    hyrox: 'text-yellow-600 hover:border-yellow-200',
}

/* =========================
   Component
========================= */

/**
 * Tarjeta compacta para editar el desnivel (metros) de una actividad.
 *
 * Características:
 * - Permite `null` para representar ausencia de dato.
 * - Input numérico simple (mobile-friendly).
 * - Estilos por variante: color del "+" y feedback visual en hover.
 *
 * Contrato:
 * - `value` usa `number | null`.
 * - `onChange` emite `null` si el input queda vacío; si no, emite metros enteros.
 */
export default function ElevationCard({
    value,
    onChange,
    color = 'green',
    label = 'Desnivel',
    icon: Icon = Mountain
}: ElevationCardProps) {
    /**
     * Clases derivadas del tema.
     * Se usan por separado para:
     * - contenedor (hover)
     * - signo "+"
     */
    const themeClass = THEME[color]

    return (
        <div
            className={`
                bg-white rounded-2xl p-4 border border-gray-100 flex flex-col justify-center h-full
                transition-colors
                ${themeClass.split(' ')[1]}
            `}
        >
            <div className="flex items-center text-gray-400 mb-2">
                <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            </div>

            <div className="flex items-baseline">
                {/* El color del signo "+" depende de la variante seleccionada */}
                <span className={`text-lg font-bold mr-1 ${themeClass.split(' ')[0]}`}>+</span>

                <input
                    type="number"
                    inputMode="numeric"
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="0"
                    className="w-full bg-transparent text-2xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none p-0"
                    aria-label={`${label} en metros`}
                />

                <span className="text-sm font-medium text-gray-400 ml-1">m</span>
            </div>
        </div>
    )
}