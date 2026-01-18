import { Dog, type LucideIcon } from 'lucide-react'
import type { ColorVariant } from '../../types/ui'

/* =========================
   Types
========================= */

/**
 * Tema visual asociado a una variante.
 *
 * Cada propiedad representa una clase Tailwind concreta usada en el header
 * (modo compacto y modo completo).
 */
type VariantTheme = {
    /** Fondo sólido en modo compacto. */
    compactBg: string
    /** Gradiente (sin el prefijo `bg-gradient-to-*`) en modo completo. */
    gradient: string
    /** Color de texto “suave” (label/subtitle). */
    textLight: string
    /** Color del icono decorativo grande en el fondo. */
    iconDecorColor: string
    /** Color del título principal. */
    titleColor: string
    /** Color del icono principal (visible). */
    iconMainColor: string
}

/**
 * Temas por variante.
 *
 * Importante: las clases Tailwind están definidas explícitamente para asegurar que el build las incluya.
 */
const VARIANTS: Record<ColorVariant, VariantTheme> = {
    green: {
        compactBg: 'bg-green-600',
        gradient: 'from-green-500 to-green-600',
        textLight: 'text-green-100',
        iconDecorColor: 'text-green-200',
        titleColor: 'text-white',
        iconMainColor: 'text-white',
    },
    blue: {
        compactBg: 'bg-blue-600',
        gradient: 'from-blue-500 to-blue-600',
        textLight: 'text-blue-100',
        iconDecorColor: 'text-blue-200',
        titleColor: 'text-white',
        iconMainColor: 'text-white',
    },
    purple: {
        compactBg: 'bg-purple-600',
        gradient: 'from-purple-500 to-purple-600',
        textLight: 'text-purple-100',
        iconDecorColor: 'text-purple-200',
        titleColor: 'text-white',
        iconMainColor: 'text-white',
    },
    hyrox: {
        compactBg: 'bg-yellow-400',
        gradient: 'from-yellow-400 to-yellow-500',
        textLight: 'text-yellow-900',
        iconDecorColor: 'text-yellow-800',
        titleColor: 'text-black',
        iconMainColor: 'text-black',
    },
}

/**
 * Props del componente {@link ActivityHeader}.
 */
type ActivityHeaderProps = {
    /** Título principal. Se renderiza siempre. */
    title: string

    /** Subtítulo opcional (debajo del título). */
    subtitle?: string

    /**
     * Etiqueta pequeña (uppercased) para contextualizar el header.
     * @default 'ACTIVITY'
     */
    label?: string

    /**
     * Activa el modo compacto (barra superior) pensado para vistas con poco espacio.
     * @default false
     */
    compact?: boolean

    /**
     * Icono a mostrar. Por defecto se usa {@link Dog}.
     *
     * Debe ser un componente Lucide (tipo {@link LucideIcon}).
     * @default Dog
     */
    icon?: LucideIcon

    /**
     * Variante visual soportada por este componente.
     * Definida como subtipo de `ColorVariant` en `types/ui`.
     */
    color?: ColorVariant
}

/* =========================
   Component
========================= */

/**
 * Header reutilizable con dos modos:
 *
 * - **Completo**: fondo degradado + icono decorativo grande, label, título y subtítulo.
 * - **Compacto**: barra superior simple con icono y título truncado.
 *
 * Accesibilidad:
 * - Los iconos visibles llevan `aria-hidden="true"` para no duplicar información.
 * - El texto (label/título/subtítulo) es el contenido semántico principal.
 */
function ActivityHeader({
    title,
    subtitle,
    label = 'ACTIVITY',
    compact = false,
    icon: Icon = Dog,
    color = 'green',
}: ActivityHeaderProps) {
    /**
     * Tema derivado de la variante seleccionada.
     * Garantiza clases Tailwind conocidas en build-time.
     */
    const theme = VARIANTS[color]

    // Modo compacto: barra simple, ideal para top bars en móvil.
    if (compact) {
        return (
            <header className={`${theme.compactBg} px-4 py-3 flex items-center shadow-sm transition-all`}>
                <div className="flex items-center min-w-0 w-full">
                    <Icon className={`w-6 h-6 ${theme.iconMainColor} mr-2 flex-shrink-0`} aria-hidden="true" />
                    <h1 className={`text-lg font-bold ${theme.titleColor} truncate`}>
                        {title}
                    </h1>
                </div>
            </header>
        )
    }

    // Modo completo: gradiente + icono decorativo + label + título + subtítulo (opcional).
    return (
        <header className={`bg-gradient-to-br ${theme.gradient} px-6 pt-8 pb-10 relative overflow-hidden shadow-md`}>
            {/* Icono decorativo (no interactivo) para reforzar marca/tema visual. */}
            <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none select-none" aria-hidden="true">
                <Icon className={`w-40 h-40 transform translate-x-8 translate-y-8 ${theme.iconDecorColor}`} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center mb-2">
                    <Icon className={`w-8 h-8 ${theme.iconMainColor} mr-3`} aria-hidden="true" />
                    <span className={`${theme.textLight} text-sm font-bold uppercase tracking-wider`}>
                        {label}
                    </span>
                </div>

                <h1 className={`text-3xl font-bold ${theme.titleColor} leading-tight`}>
                    {title}
                </h1>

                {subtitle && (
                    <p className={`${theme.textLight} mt-1 font-medium opacity-90`}>
                        {subtitle}
                    </p>
                )}
            </div>
        </header>
    )
}

export default ActivityHeader