import { useEffect, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

/* =========================
   Types
========================= */

/**
 * Variantes de color soportadas por {@link DistanceInput}.
 *
 * Se usan para mapear clases Tailwind “estáticas” y evitar clases dinámicas
 * que Tailwind no detecta durante el build.
 */
type ColorVariant = 'green' | 'blue' | 'hyrox'

/**
 * Props del componente {@link DistanceInput}.
 */
type DistanceInputProps = {
    /**
     * Valor controlado en **metros enteros**.
     *
     * Importante: internamente el componente puede mostrar km/mi o m/yd según `settings.distanceUnit`,
     * pero el contrato de entrada/salida siempre es metros (number entero).
     */
    value: number // METROS ENTEROS (Integer)

    /**
     * Callback de cambios. Siempre emite metros enteros (redondeados).
     *
     * @param meters Distancia en metros (entero, clamped a [0..max]).
     */
    onChange: (meters: number) => void

    /**
     * Variante visual.
     * @default 'green'
     */
    color?: ColorVariant

    /**
     * Modo de entrada:
     * - `long`: muestra km/mi (con decimales), pensado para distancias largas.
     * - `short`: muestra m/yd (sin decimales), pensado para intervalos cortos (piscina/track).
     *
     * @default 'long'
     */
    mode?: 'long' | 'short'

    /**
     * Incremento/decremento (botones +/-) en **metros**.
     * Si no se indica, se usa un step por defecto según `mode` y unidad.
     */
    step?: number

    /**
     * Presets mostrados como chips. El array se interpreta en la **unidad visible**:
     * - `mode='long'`: valores en km o mi (según settings)
     * - `mode='short'`: valores en m o yd (según settings)
     *
     * Si no se indica, se usan presets por defecto.
     */
    presets?: number[]

    /**
     * Máximo permitido en metros (clamp).
     * @default 999000
     */
    max?: number
}

/**
 * Tema visual interno para estilos del componente.
 */
type Theme = {
    /** Fondo base del contenedor. */
    bgStart: string
    /** Estilo del chip activo (preset seleccionado). */
    activeChip: string
    /** Estilo del botón de incremento (+). */
    plusBtn: string
    /** Color del número principal. */
    text: string
    /** Color de la unidad (km/mi/m/yd). */
    subText: string
}

/* =========================
   Theme
========================= */

/**
 * Temas por variante.
 *
 * Importante: se definen clases Tailwind explícitas para que se incluyan en build-time.
 */
const THEME: Record<ColorVariant, Theme> = {
    green: {
        bgStart: 'bg-white',
        activeChip: 'bg-green-500 text-white shadow-green-200',
        plusBtn: 'bg-green-500 hover:bg-green-600 shadow-green-200 text-white',
        text: 'text-gray-900',
        subText: 'text-gray-400',
    },
    blue: {
        bgStart: 'bg-white',
        activeChip: 'bg-blue-500 text-white shadow-blue-200',
        plusBtn: 'bg-blue-500 hover:bg-blue-600 shadow-blue-200 text-white',
        text: 'text-gray-900',
        subText: 'text-gray-400',
    },
    hyrox: {
        bgStart: 'bg-white',
        activeChip: 'bg-yellow-400 text-black shadow-yellow-200',
        plusBtn: 'bg-yellow-400 hover:bg-yellow-500 shadow-yellow-200 text-black',
        text: 'text-black',
        subText: 'text-gray-500',
    },
}

/* =========================
   Component
========================= */

/**
 * Input de distancia controlado (metros enteros) con:
 * - Chips de presets en la unidad visible.
 * - Botones +/- para ajustar por step.
 * - Campo de texto con formateo y normalización decimal (coma/punto).
 * - Conversión automática a km/mi o m/yd en función de:
 *   - `mode` (long/short)
 *   - `settings.distanceUnit` (KM/MI) desde {@link useSettings}
 *
 * Contrato:
 * - Entrada (`value`) y salida (`onChange`) siempre en **metros** (enteros).
 *
 * Notas de UX:
 * - Mientras el input está enfocado, no se fuerza el formateo (para no “pelearse” con el usuario).
 * - Al perder foco, se formatea al número de decimales esperado.
 */
export default function DistanceInput({
    value,
    onChange,
    color = 'green',
    mode = 'long',
    step,
    presets,
    max = 999000,
}: DistanceInputProps) {
    const { settings } = useSettings()
    const styles = THEME[color]

    /** Determina si la unidad base del usuario es métrica (KM) o imperial (MI). */
    const isMetric = settings.distanceUnit === 'KM'

    /**
     * Factor de conversión desde “unidad visible” a metros:
     * - long: km -> 1000, mi -> 1609.344
     * - short: m -> 1, yd -> 0.9144
     *
     * `decimals` controla el formato del input visible.
     */
    let factor = 1
    let unitLabel = ''
    let decimals = 0

    if (mode === 'long') {
        factor = isMetric ? 1000 : 1609.344
        unitLabel = isMetric ? 'km' : 'mi'
        decimals = 2
    } else {
        factor = isMetric ? 1 : 0.9144
        unitLabel = isMetric ? 'm' : 'yd'
        decimals = 0
    }

    /**
     * Presets por defecto en la unidad visible (no en metros).
     * - long + KM: [5, 10, 15, 21]
     * - long + MI: [3, 5, 6, 10, 13]
     * - short: [25, 50, 100, 200, 400]
     */
    const defaultPresets =
        presets ??
        (mode === 'long'
            ? isMetric
                ? [5, 10, 15, 21]
                : [3, 5, 6, 10, 13]
            : [25, 50, 100, 200, 400])

    /**
     * Step por defecto (en metros) si no se pasa por props:
     * - long: 500m (KM) o 400m (MI) como incremento cómodo
     * - short: 25m (típico intervalos)
     */
    const defaultStep = mode === 'long' ? (isMetric ? 500 : 400) : 25
    const activeStep = step || defaultStep

    /**
     * Valor del input como string para permitir:
     * - edición progresiva (ej. "1.", "")
     * - normalización coma/punto
     * - evitar saltos visuales al escribir
     */
    const [inputValue, setInputValue] = useState('')

    /** Ref para saber si el input está enfocado y evitar sobrescribir mientras el usuario escribe. */
    const inputRef = useRef<HTMLInputElement>(null)

    /**
     * Emite cambios al padre garantizando:
     * - clamp a [0..max]
     * - enteros en metros
     */
    const updateParent = (meters: number) => {
        const safe = Math.min(Math.max(0, meters), max)
        onChange(Math.round(safe))
    }

    /**
     * Sincroniza el string visible cuando cambia `value` desde fuera,
     * pero no si el usuario está escribiendo (input enfocado).
     */
    useEffect(() => {
        if (document.activeElement !== inputRef.current) {
            const visualVal = value / factor
            setInputValue(visualVal.toFixed(decimals))
        }
    }, [value, factor, decimals])

    /**
     * Selección de un preset (en unidad visible).
     *
     * @param visualAmount Cantidad en la unidad visible (km/mi o m/yd).
     */
    const handleChipClick = (visualAmount: number) => {
        updateParent(visualAmount * factor)
    }

    /**
     * Ajuste por step (en metros) con botones +/-.
     *
     * @param direction -1 decrementa, +1 incrementa.
     */
    const handleStepClick = (direction: -1 | 1) => {
        updateParent(value + direction * activeStep)
    }

    /**
     * Maneja cambios del input de texto:
     * - Normaliza `,` a `.` para parseo
     * - Valida formato numérico simple (dígitos + decimal)
     * - Emite al padre sólo si el número es parseable
     * - Si el input queda vacío, se interpreta como 0
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value
        const normalized = raw.replace(/,/g, '.')

        // Permite estados intermedios ("" / "1."), pero bloquea caracteres no numéricos.
        if (!/^\d*\.?\d*$/.test(normalized)) return

        setInputValue(raw)

        const parsed = parseFloat(normalized)
        if (!isNaN(parsed)) {
            updateParent(parsed * factor)
        } else if (raw === '') {
            updateParent(0)
        }
    }

    /**
     * En blur, fuerza el formateo “bonito” acorde a `decimals`.
     * Esto elimina estados intermedios como "1." o "".
     */
    const handleBlur = () => {
        const visualVal = value / factor
        setInputValue(visualVal.toFixed(decimals))
    }

    return (
        <div className={`px-4 py-6 rounded-xl ${styles.bgStart}`}>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {defaultPresets.map((preset) => {
                    const presetMeters = Math.round(preset * factor)

                    /**
                     * Chip activo si el valor actual está “casi igual” al preset.
                     * Se usa tolerancia para evitar problemas por redondeos (factor imperial).
                     */
                    const isActive = Math.abs(value - presetMeters) < 2

                    return (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => handleChipClick(preset)}
                            className={`
                px-4 py-1.5 rounded-full text-sm font-semibold transition-all
                ${isActive ? styles.activeChip : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
                        >
                            {preset}
                            <span className="text-xs ml-0.5">{unitLabel}</span>
                        </button>
                    )
                })}
            </div>

            <div className="flex items-center justify-center gap-4">
                <button
                    type="button"
                    onClick={() => handleStepClick(-1)}
                    aria-label="Disminuir distancia"
                    className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-all flex-shrink-0 select-none"
                >
                    <Minus className="w-6 h-6" />
                </button>

                <div className="flex items-baseline justify-center w-40">
                    <input
                        ref={inputRef}
                        type="text"
                        inputMode={decimals > 0 ? 'decimal' : 'numeric'}
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={(e) => e.target.select()}
                        onBlur={handleBlur}
                        className={`w-full text-center text-5xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 ${styles.text}`}
                        placeholder="0"
                        autoComplete="off"
                        aria-label="Distancia"
                    />
                    <span className={`text-2xl font-medium ml-1 ${styles.subText}`}>{unitLabel}</span>
                </div>

                <button
                    type="button"
                    onClick={() => handleStepClick(1)}
                    aria-label="Aumentar distancia"
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all flex-shrink-0 select-none ${styles.plusBtn}`}
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}