import { Heart } from 'lucide-react'

type IntensityCardProps = {
    heartRate: number | null
    onHeartRateChange: (hr: number | null) => void
    feeling: number | null  // 1-5
    onFeelingChange: (feeling: number | null) => void
}

const FEELINGS = [
    { value: 1, emoji: '😫', label: 'Muy duro' },
    { value: 2, emoji: '😓', label: 'Duro' },
    { value: 3, emoji: '😊', label: 'Normal' },
    { value: 4, emoji: '😄', label: 'Bien' },
    { value: 5, emoji: '🤩', label: 'Genial' },
]

function IntensityCard({ heartRate, onHeartRateChange, feeling, onFeelingChange }: IntensityCardProps) {
    const getHrPosition = (hr: number | null): number => {
        if (!hr) return 0
        const min = 100
        const max = 200
        const clamped = Math.max(min, Math.min(max, hr))
        return ((clamped - min) / (max - min)) * 100
    }

    const hrPosition = getHrPosition(heartRate)

    return (
        <div className="mx-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-5">
            {/* Header */}
            <div className="flex items-center text-gray-500">
                <Heart className="w-4 h-4 mr-2" />
                <span className="text-xs font-semibold uppercase tracking-wider">Intensidad</span>
            </div>

            {/* FC Media */}
            <div>
                <label className="block text-sm text-gray-500 mb-2">Frecuencia Cardíaca Media</label>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        value={heartRate ?? ''}
                        onChange={(e) => onHeartRateChange(e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="145"
                        className="w-24 h-12 text-center text-2xl font-bold text-gray-900 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-gray-400 font-medium">bpm</span>
                </div>

                {/* Barra de gradiente con indicador */}
                <div className="mt-3 relative">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500" />

                    {heartRate && (
                        <div
                            className="absolute -top-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gray-800 transition-all duration-300"
                            style={{ left: `calc(${hrPosition}% - 6px)` }}
                        />
                    )}

                    {/* Labels */}
                    <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                        <span>Recuperación</span>
                        <span>Aeróbico</span>
                        <span>Umbral</span>
                        <span>VO2</span>
                    </div>
                </div>
            </div>

            {/* Separador */}
            <div className="h-px bg-gray-100" />

            {/* Sensación */}
            <div>
                <label className="block text-sm text-gray-500 mb-3">¿Cómo te has sentido?</label>
                <div className="flex justify-between">
                    {FEELINGS.map((f) => (
                        <button
                            key={f.value}
                            type="button"
                            onClick={() => onFeelingChange(feeling === f.value ? null : f.value)}
                            className={`
                                flex flex-col items-center p-2 rounded-xl transition-all
                                ${feeling === f.value
                                    ? 'bg-green-50 ring-2 ring-green-400 scale-110'
                                    : 'hover:bg-gray-50'
                                }
                            `}
                        >
                            <span className="text-2xl mb-1">{f.emoji}</span>
                            <span className={`text-[10px] font-medium ${feeling === f.value ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                {f.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default IntensityCard