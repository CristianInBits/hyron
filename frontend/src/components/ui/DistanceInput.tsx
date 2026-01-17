import { useEffect, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

type ColorVariant = 'green' | 'blue' | 'hyrox'

type DistanceInputProps = {
    value: number // METROS ENTEROS (Integer)
    onChange: (meters: number) => void
    color?: ColorVariant
    mode?: 'long' | 'short'
    step?: number
    presets?: number[]
    max?: number
}

type Theme = {
    bgStart: string
    activeChip: string
    plusBtn: string
    text: string
    subText: string
}

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

    const isMetric = settings.distanceUnit === 'KM'

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

    const defaultPresets =
        presets ??
        (mode === 'long'
            ? isMetric
                ? [5, 10, 15, 21]
                : [3, 5, 6, 10, 13]
            : [25, 50, 100, 200, 400])

    const defaultStep = mode === 'long' ? (isMetric ? 500 : 400) : 25
    const activeStep = step || defaultStep

    const [inputValue, setInputValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const updateParent = (meters: number) => {
        const safe = Math.min(Math.max(0, meters), max)
        onChange(Math.round(safe))
    }

    useEffect(() => {
        if (document.activeElement !== inputRef.current) {
            const visualVal = value / factor
            setInputValue(visualVal.toFixed(decimals))
        }
    }, [value, factor, decimals])

    const handleChipClick = (visualAmount: number) => {
        updateParent(visualAmount * factor)
    }

    const handleStepClick = (direction: -1 | 1) => {
        updateParent(value + direction * activeStep)
    }

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

    const handleBlur = () => {
        const visualVal = value / factor
        setInputValue(visualVal.toFixed(decimals))
    }

    return (
        <div className={`px-4 py-6 rounded-xl ${styles.bgStart}`}>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {defaultPresets.map((preset) => {
                    const presetMeters = Math.round(preset * factor)
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