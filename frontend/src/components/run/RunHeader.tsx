import { Dog, type LucideIcon } from 'lucide-react'

/**
 * Props de configuración para el encabezado de actividad.
 */
type RunHeaderProps = {
    /** Título principal de la actividad o sección. */
    title: string
    /** Subtítulo descriptivo. Solo se muestra en el modo expandido (no compacto). */
    subtitle?: string
    /** * Define el modo visual del encabezado.
     * - `true`: Modo barra simple (ahorra espacio).
     * - `false`: Modo tarjeta expandida con decoraciones (por defecto).
     */
    compact?: boolean
    /** * Icono de la librería Lucide a mostrar.
     * Se debe pasar la referencia del componente (ej: `Waves`), no el elemento (`<Waves />`).
     * @default Dog (Icono de perro por defecto si no se especifica otro)
     */
    icon?: LucideIcon
}

/**
 * # RunHeader (Encabezado de Actividad)
 * * Un componente de encabezado semántico (`<header>`) diseñado para mostrar títulos de actividades deportivas.
 * Soporta dos visualizaciones (compacta/expandida) y permite personalizar el icono para diferentes deportes.
 * * ## Características:
 * - **Semántico:** Usa la etiqueta HTML5 `<header>` para accesibilidad y SEO.
 * - **Flexible:** Acepta cualquier icono de la librería `lucide-react`.
 * - **Decorativo:** En modo expandido, incluye un patrón de fondo con el icono en gran tamaño.
 * * @example
 * // 1. Uso básico (Running por defecto)
 * <RunHeader title="Carrera Suave" />
 * * @example
 * // 2. Uso personalizado (Natación)
 * import { Waves } from 'lucide-react'
 * <RunHeader title="Natación" icon={Waves} subtitle="100 largos" />
 */
function RunHeader({ title, subtitle, compact = false, icon: Icon = Dog }: RunHeaderProps) {
    if (compact) {
        return (
            <header className="bg-green-500 px-4 py-3 flex items-center shadow-sm transition-all">
                <Icon className="w-6 h-6 text-white mr-2" />
                <h1 className="text-lg font-bold text-white">{title}</h1>
            </header>
        )
    }

    return (
        <header className="bg-gradient-to-br from-green-500 to-green-600 px-6 pt-8 pb-10 relative overflow-hidden shadow-md">
            {/* Decoración de fondo: Icono gigante con opacidad reducida */}
            <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none select-none">
                <Icon className="w-40 h-40 text-white transform translate-x-8 translate-y-8" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center mb-2">
                    <Icon className="w-8 h-8 text-white mr-3" />
                    <span className="text-green-100 text-sm font-medium uppercase tracking-wider">
                        Running
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                {subtitle && (
                    <p className="text-green-100 mt-1 font-medium opacity-90">{subtitle}</p>
                )}
            </div>
        </header>
    )
}

export default RunHeader