import { useEffect, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import type { DistanceColorVariant as ColorVariant } from '../../types/ui'

/* =========================
   Types
========================= */

/**
 * Props del componente {@link DistanceInput}.
 */
type DistanceInputProps = {
    /**
     * Valor controlado en **metros enteros**.
     *
     * El componente puede mostrar este valor en km/mi o m/yd (según `mode` y `settings.distanceUnit`),
     * pero el contrato de entrada/salida siempre es en metros.
     */
    value: number // METROS ENTEROS (Integer)

    /**
     * Callback cuando cambia la distancia.
     *
     * Se emite siempre en **metros enteros**, con clamp a [0..max].
     *
     * @param meters Distancia total en metros (entero).
     */
    onChange: (meters: number) => void

    /**
     * Variante visual soportada por este componente.
     *
     * Se restringe a {@link DistanceColorVariant} para evitar variantes no soportadas en THEME.
     * @default 'green'
     */
    color?: ColorVariant

    /**
     * Modo visual:
     * - `long`: muestra km/mi con decimales (distancias largas).
     * - `short`: muestra m/yd sin decimales (intervalos cortos).
     *
     * @default 'long'
     */
    mode?: 'long' | 'short'

    /**
     * Incremento/decremento (botones +/-) en **metros**.
     * Si no se proporciona, se usa un step por defecto según `mode` y unidad.
     */
    step?: number

    /**
     * Presets mostrados como chips, expresados en la **unidad visible**:
     * - `mode='long'`: valores en km o mi
     * - `mode='short'`: valores en m o yd
     *
     * Si no se proporciona, se generan presets por defecto.
     */
    presets?: number[]

    /**
     * Máximo permitido en metros.
     * @default 999000
     */
    max?: number
}

/**
 * Tema visual interno (clases Tailwind) para {@link DistanceInput}.
 */
type Theme = {
    /** Fondo del contenedor. */
    bgStart: string
    /** Estilo del chip activo. */
    activeChip: string
    /** Estilo del botón de incremento (+). */
    plusBtn: string
    /** Color del número principal. */
    text: string
    /** Color del sufijo de unidad (km/mi/m/yd). */
    subText: string
}

/**
 * Mapa de estilos por variante.
 *
 * Importante: clases Tailwind explícitas para asegurar inclusión en build-time.
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
 * Input de distancia mobile-first con:
 * - Presets en chips (selección rápida).
 * - Stepper +/- con incremento configurable.
 * - Campo de texto para entrada manual con normalización decimal.
 *
 * Conversión de unidades:
 * - El valor de entrada/salida es siempre **metros enteros**.
 * - La unidad visible depende de:
 *   - `mode` (`long` → km/mi, `short` → m/yd)
 *   - `settings.distanceUnit` (KM/MI) vía {@link useSettings}
 *
 * UX:
 * - Mientras el input está enfocado, no se fuerza el formateo para no interferir con la escritura.
 * - En blur, se normaliza y se muestra el valor con los decimales esperados.
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

    /** Estilos derivados de la variante seleccionada. */
    const styles = THEME[color]

    /** Ref para detectar foco y evitar sobreescritura del input mientras el usuario edita. */
    const inputRef = useRef<HTMLInputElement>(null)

    /**
     * Valor del input como string para permitir estados intermedios (ej. "", "1.", "0,5"),
     * evitando saltos visuales mientras se escribe.
     */
    const [inputValue, setInputValue] = useState('')

    /** true si el usuario trabaja en métrico (KM) o imperial (MI). */
    const isMetric = settings.distanceUnit === 'KM'

    /**
     * Factor de conversión desde unidad visible a metros y configuración de formato.
     *
     * - long: km (1000) / mi (1609.344), con 2 decimales
     * - short: m (1) / yd (0.9144), sin decimales
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
     * Presets por defecto expresados en unidad visible:
     * - long + KM: distancias típicas (5k, 10k, 15k, 21k)
     * - long + MI: aproximaciones comunes en millas
     * - short: distancias típicas de intervalos
     */
    const defaultPresets =
        presets ??
        (mode === 'long'
            ? (isMetric ? [5, 10, 15, 21] : [3, 5, 6, 10, 13])
            : [25, 50, 100, 200, 400])

    /**
     * Step por defecto (en metros) si no se indica por props:
     * - long: 500m (KM) / 400m (MI)
     * - short: 25m
     */
    const defaultStep = mode === 'long' ? (isMetric ? 500 : 400) : 25
    const activeStep = step || defaultStep

    /**
     * Emite cambios al padre garantizando:
     * - clamp a [0..max]
     * - entero en metros (redondeo)
     */
    const updateParent = (meters: number) => {
        const safe = Math.min(Math.max(0, meters), max)
        onChange(Math.round(safe))
    }

    /**
     * Sincroniza el string visible cuando cambia `value` desde fuera,
     * pero no mientras el usuario está editando (input enfocado).
     */
    useEffect(() => {
        if (document.activeElement !== inputRef.current) {
            const visualVal = value / factor
            setInputValue(visualVal.toFixed(decimals))
        }
    }, [value, factor, decimals])

    /**
     * Selección rápida desde un chip (preset en unidad visible).
     */
    const handleChipClick = (visualAmount: number) => {
        updateParent(visualAmount * factor)
    }

    /**
     * Ajuste por step (en metros) con botones +/-.
     */
    const handleStepClick = (direction: -1 | 1) => {
        updateParent(value + direction * activeStep)
    }

    /**
     * Entrada manual:
     * - Normaliza coma a punto para parsear.
     * - Permite sólo números y un decimal.
     * - Si el valor es parseable, actualiza al padre en metros.
     * - Si queda vacío, se interpreta como 0.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value
        const normalized = raw.replace(/,/g, '.')

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
     * Al perder foco, normaliza el valor mostrado al formato esperado.
     */
    const handleBlur = () => {
        const visualVal = value / factor
        setInputValue(visualVal.toFixed(decimals))
    }

    return (
        <div className={`px-4 py-6 rounded-xl ${styles.bgStart}`}>
            {/* Chips (presets) */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {defaultPresets.map((preset) => {
                    const presetMeters = Math.round(preset * factor)

                    /**
                     * Se usa una tolerancia pequeña para marcar activo, ya que la conversión
                     * (especialmente en imperial) puede introducir redondeos.
                     */
                    const isActive = Math.abs(value - presetMeters) < 2

                    return (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => handleChipClick(preset)}
                            aria-label={`Seleccionar ${preset} ${unitLabel}`}
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

            {/* Stepper + Input */}
            <div className="flex items-center justify-center gap-4">
                <button
                    type="button"
                    onClick={() => handleStepClick(-1)}
                    aria-label="Disminuir distancia"
                    className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-all flex-shrink-0 select-none"
                >
                    <Minus className="w-6 h-6" />
                </button>

                <div className="flex items-baseline justify-center w-48">
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
                        aria-label="Distancia personalizada"
                    />
                    <span className={`text-2xl font-medium ml-1 flex-shrink-0 ${styles.subText}`}>
                        {unitLabel}
                    </span>
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