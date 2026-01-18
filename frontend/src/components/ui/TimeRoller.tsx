import { useEffect, useRef, useMemo } from 'react'
import type { ColorVariant } from '../../types/ui'

/* =========================
   Types
========================= */

/**
 * Formatos de visualización soportados por {@link TimeRoller}.
 *
 * Determina qué columnas se renderizan:
 * - `hh:mm:ss` → horas + minutos + segundos
 * - `hh:mm`    → horas + minutos
 * - `mm:ss`    → minutos + segundos
 * - `ss`       → solo segundos
 */
type TimeFormat = 'hh:mm:ss' | 'hh:mm' | 'mm:ss' | 'ss'

/**
 * Props del componente {@link TimeRoller}.
 */
type TimeRollerProps = {
    /**
     * Valor controlado en segundos totales.
     *
     * El componente descompone este valor en horas/minutos/segundos según `format`.
     */
    value: number

    /**
     * Callback cuando cambia el tiempo seleccionado.
     *
     * @param totalSeconds Tiempo total en segundos.
     */
    onChange: (totalSeconds: number) => void

    /**
     * Formato de columnas visible.
     * @default 'mm:ss'
     */
    format?: TimeFormat

    /**
     * Variante visual (color del valor activo).
     *
     * Se restringe a {@link TimeColorVariant} para garantizar consistencia con el mapa {@link THEME}.
     * @default 'green'
     */
    color?: ColorVariant

    /**
     * Límite máximo permitido en segundos.
     * Si se especifica, el valor final se clampa automáticamente.
     */
    maxSeconds?: number
}

/* =========================
   Constants
========================= */

/**
 * Altura en píxeles de cada elemento del rodillo.
 *
 * Es un valor crítico para:
 * - calcular el índice seleccionado: `index ≈ scrollTop / ITEM_HEIGHT`
 * - posicionar el scroll programáticamente: `top = index * ITEM_HEIGHT`
 */
const ITEM_HEIGHT = 40

/**
 * Clases Tailwind por variante para resaltar el valor seleccionado.
 */
const THEME: Record<ColorVariant, string> = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    hyrox: 'text-yellow-500',
}

/**
 * Genera un rango de enteros [0..n-1].
 */
const range = (n: number) => Array.from({ length: n }, (_, i) => i)

/* =========================
   Subcomponent: RollerColumn
========================= */

/**
 * Props internas del subcomponente {@link RollerColumn}.
 */
type RollerColumnProps = {
    /** Lista de valores permitidos para la columna (en orden). */
    options: number[]

    /** Valor actualmente seleccionado. */
    value: number

    /**
     * Callback cuando cambia la selección.
     *
     * @param val Valor seleccionado (pertenece a `options`).
     */
    onChange: (val: number) => void

    /** Etiqueta superior opcional (ej. Hr/Min/Seg). */
    label?: string

    /** Clase Tailwind usada para resaltar el valor activo. */
    colorClass: string
}

/**
 * Columna de selección tipo “rodillo” basada en scroll vertical.
 *
 * Interacción:
 * - Scroll con `snap-y` para centrar elementos.
 * - Clic en un elemento para seleccionarlo directamente.
 *
 * Sincronización:
 * - Si cambia `value` desde fuera, el rodillo se posiciona en ese valor
 *   (siempre que el usuario no esté scrolleando manualmente).
 *
 * Nota de estilo:
 * - `no-scrollbar` se asume definido en CSS global para ocultar la barra.
 */
function RollerColumn({ options, value, onChange, label, colorClass }: RollerColumnProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    /**
     * Flag de interacción del usuario.
     *
     * Se mantiene en un ref para no provocar re-renders durante el scroll
     * y para evitar que la sincronización externa “pelee” contra el gesto del usuario.
     */
    const isUserScrolling = useRef(false)

    /**
     * Timeout para detectar fin de scroll (debounce).
     * Se limpia en un cleanup para evitar timeouts colgando.
     */
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    /**
     * Sincroniza el scroll cuando cambia el valor externo.
     *
     * Usa `options.indexOf(value)` para soportar columnas cuyo rango no siempre es 0..n-1.
     */
    useEffect(() => {
        if (scrollRef.current && !isUserScrolling.current) {
            const index = options.indexOf(value)
            if (index !== -1) {
                scrollRef.current.scrollTo({
                    top: index * ITEM_HEIGHT,
                    behavior: 'smooth',
                })
            }
        }
    }, [value, options])

    /**
     * Cleanup al desmontar:
     * evita que un timeout pendiente intente mutar refs tras un unmount.
     */
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    /**
     * Maneja el scroll:
     * - Marca el rodillo como “en interacción”.
     * - Calcula el índice aproximado (por altura de item).
     * - Clampa el índice al rango válido.
     * - Emite el valor seleccionado si cambia.
     * - Libera el flag de interacción tras 100ms sin scroll.
     */
    const handleScroll = () => {
        if (!scrollRef.current) return
        isUserScrolling.current = true

        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        const scrollTop = scrollRef.current.scrollTop
        const index = Math.round(scrollTop / ITEM_HEIGHT)

        const safeIndex = Math.min(Math.max(0, index), options.length - 1)
        const selectedValue = options[safeIndex]

        if (selectedValue !== value) onChange(selectedValue)

        timeoutRef.current = setTimeout(() => {
            isUserScrolling.current = false
        }, 100)
    }

    return (
        <div className="flex flex-col items-center relative z-20">
            {label && (
                <span className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                    {label}
                </span>
            )}

            <div className="relative h-[120px] w-14 sm:w-16">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="h-full w-full overflow-y-scroll overflow-x-hidden snap-y snap-mandatory no-scrollbar"
                >
                    {/* Espaciador superior para permitir centrado del primer item */}
                    <div style={{ height: ITEM_HEIGHT }} className="flex-shrink-0" />

                    {options.map((option) => {
                        const isSelected = option === value
                        return (
                            <div
                                key={option}
                                style={{ height: ITEM_HEIGHT }}
                                onClick={() => {
                                    // Permite aplicar selección inmediata (sin bloquear sincronización).
                                    isUserScrolling.current = false
                                    onChange(option)
                                }}
                                className={`
                  flex items-center justify-center snap-center transition-all duration-200 cursor-pointer w-full select-none flex-shrink-0
                  ${isSelected
                                        ? `text-2xl font-bold ${colorClass} scale-110`
                                        : 'text-lg text-gray-300 scale-90 opacity-60 hover:opacity-80'
                                    }
                `}
                            >
                                {option.toString().padStart(2, '0')}
                            </div>
                        )
                    })}

                    {/* Espaciador inferior para permitir centrado del último item */}
                    <div style={{ height: ITEM_HEIGHT }} className="flex-shrink-0" />
                </div>
            </div>
        </div>
    )
}

/* =========================
   Component: TimeRoller
========================= */

/**
 * Selector de tiempo tipo “roller” (rueda) con efecto snap.
 *
 * Contrato:
 * - Entrada (`value`) y salida (`onChange`) siempre en **segundos totales**.
 *
 * Formatos:
 * - Cuando `format` no incluye horas, el valor se interpreta como `mm:ss`/`ss`
 *   y la columna de minutos puede llegar a 99 (para tiempos largos sin horas).
 *
 * Rendimiento:
 * - Se usa {@link useMemo} para:
 *   - descomponer `value` evitando cálculos repetidos
 *   - construir listas de opciones estables
 */
export default function TimeRoller({
    value,
    onChange,
    format = 'mm:ss',
    color = 'green',
    maxSeconds,
}: TimeRollerProps) {
    const showHours = format.includes('hh')
    const showMinutes = format.includes('mm')
    const showSeconds = format.includes('ss')

    /**
     * Descompone `value` en h/m/s:
     * - Si se muestran horas: hh:mm:ss
     * - Si no: m puede crecer (0..99) y h se fija a 0
     */
    const { h, m, s } = useMemo(() => {
        if (showHours) {
            return {
                h: Math.floor(value / 3600),
                m: Math.floor((value % 3600) / 60),
                s: value % 60,
            }
        }

        return {
            h: 0,
            m: Math.floor(value / 60),
            s: value % 60,
        }
    }, [value, showHours])

    /** Opciones estables para evitar recreación innecesaria en cada render. */
    const hoursOpts = useMemo(() => range(24), [])
    const secondsOpts = useMemo(() => range(60), [])
    const minutesOpts = useMemo(() => (showHours ? range(60) : range(100)), [showHours])

    /**
     * Actualiza el total en segundos a partir de las columnas visibles.
     * Aplica clamp si `maxSeconds` está definido.
     */
    const updateTime = (newH: number, newM: number, newS: number) => {
        let total = showHours ? newH * 3600 + newM * 60 + newS : newM * 60 + newS
        if (typeof maxSeconds === 'number') total = Math.min(total, maxSeconds)
        onChange(total)
    }

    /**
     * Clase efectiva para el valor activo.
     * El fallback a green añade robustez ante valores no esperados.
     */
    const activeColorClass = THEME[color] || THEME.green

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 relative overflow-hidden select-none w-full max-w-sm mx-auto">
            {/* Sombras superiores/inferiores para efecto de profundidad */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white via-white/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white via-white/90 to-transparent z-10 pointer-events-none" />

            {/* Banda central que marca el elemento “seleccionado” */}
            <div className="absolute top-1/2 left-4 right-4 h-10 -translate-y-[30%] bg-gray-50 rounded-lg z-0 pointer-events-none border border-gray-200/60" />

            <div className="flex justify-center gap-1 sm:gap-4 relative z-10">
                {showHours && (
                    <>
                        <RollerColumn
                            label="Hr"
                            options={hoursOpts}
                            value={h}
                            onChange={(val) => updateTime(val, m, s)}
                            colorClass={activeColorClass}
                        />
                        <span className="flex items-center pt-4 text-gray-300 font-bold mb-3">:</span>
                    </>
                )}

                {showMinutes && (
                    <>
                        <RollerColumn
                            label="Min"
                            options={minutesOpts}
                            value={m}
                            onChange={(val) => updateTime(h, val, s)}
                            colorClass={activeColorClass}
                        />
                        {showSeconds && (
                            <span className="flex items-center pt-4 text-gray-300 font-bold mb-3">:</span>
                        )}
                    </>
                )}

                {showSeconds && (
                    <RollerColumn
                        label="Seg"
                        options={secondsOpts}
                        value={s}
                        onChange={(val) => updateTime(h, m, val)}
                        colorClass={activeColorClass}
                    />
                )}
            </div>
        </div>
    )
}