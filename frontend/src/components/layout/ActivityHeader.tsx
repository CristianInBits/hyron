import { Dog, type LucideIcon } from 'lucide-react'
import type { ColorVariant } from '../../types/ui'

type VariantTheme = {
    compactBg: string
    gradient: string
    textLight: string
    iconDecorColor: string
    titleColor: string
    iconMainColor: string
}

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

type ActivityHeaderProps = {
    title: string
    subtitle?: string
    label?: string
    compact?: boolean
    icon?: LucideIcon
    color?: ColorVariant
}

function ActivityHeader({
    title,
    subtitle,
    label = 'ACTIVITY',
    compact = false,
    icon: Icon = Dog,
    color = 'green',
}: ActivityHeaderProps) {
    const theme = VARIANTS[color]

    return (
        <header
            className={`
                relative overflow-hidden transition-all duration-500 ease-in-out z-20 shadow-md w-full
                ${compact ? `px-4 py-3 ${theme.compactBg}` : `px-6 pt-8 pb-10 bg-gradient-to-br ${theme.gradient}`}
            `}
        >
            {/* FONDO DECORATIVO */}
            <div
                className={`
                    absolute right-0 bottom-0 pointer-events-none select-none transition-all duration-500 ease-out
                    ${compact ? 'opacity-0 translate-y-12 scale-50' : 'opacity-20 translate-x-8 translate-y-8 scale-100'}
                `}
                aria-hidden="true"
            >
                <Icon className={`w-40 h-40 ${theme.iconDecorColor}`} />
            </div>

            <div className="relative z-10 flex flex-col justify-center h-full w-full">

                {/* LABEL SUPERIOR */}
                <div
                    className={`
                        flex items-center overflow-hidden transition-all duration-500 ease-in-out
                        ${compact ? 'max-h-0 opacity-0 mb-0' : 'max-h-10 opacity-100 mb-2'}
                    `}
                >
                    <Icon className={`w-8 h-8 ${theme.iconMainColor} mr-3`} aria-hidden="true" />
                    <span className={`${theme.textLight} text-sm font-bold uppercase tracking-wider`}>
                        {label}
                    </span>
                </div>

                {/* --- CONTENEDOR TÍTULO (CORREGIDO) --- */}
                <div className={`
                    flex transition-all duration-500 w-full
                    ${compact
                        ? 'flex-row items-center' // Compacto: Alineado al centro verticalmente (fila)
                        : 'flex-col items-start'  // Expandido: Alineado a la IZQUIERDA (columna)
                    }
                `}>

                    {/* Icono pequeño modo compacto */}
                    <Icon
                        className={`
                            flex-shrink-0 transition-all duration-500
                            ${compact ? 'w-6 h-6 mr-2 opacity-100' : 'w-0 h-0 mr-0 opacity-0'}
                            ${theme.iconMainColor}
                        `}
                        aria-hidden="true"
                    />

                    <h1
                        className={`
                            font-bold ${theme.titleColor} leading-tight transition-all duration-500 origin-left text-left
                            ${compact ? 'text-lg truncate' : 'text-3xl'}
                        `}
                    >
                        {title}
                    </h1>
                </div>

                {/* SUBTÍTULO */}
                {subtitle && (
                    <div
                        className={`
                            overflow-hidden transition-all duration-500 ease-in-out w-full
                            ${compact ? 'max-h-0 opacity-0 mt-0' : 'max-h-20 opacity-90 mt-1'}
                        `}
                    >
                        <p className={`${theme.textLight} font-medium leading-normal text-left`}>
                            {subtitle}
                        </p>
                    </div>
                )}
            </div>
        </header>
    )
}

export default ActivityHeader