type DurationInputProps = {
    value: number // segundos totales
    onChange: (seconds: number) => void
    className?: string
}

function DurationInput({ value, onChange, className = '' }: DurationInputProps) {
    const minutes = Math.floor(value / 60)
    const seconds = value % 60

    const handleMinutesChange = (mins: number) => {
        onChange(mins * 60 + seconds)
    }

    const handleSecondsChange = (secs: number) => {
        // Limitar segundos a 0-59
        const validSecs = Math.min(59, Math.max(0, secs))
        onChange(minutes * 60 + validSecs)
    }

    return (
        <div className={`flex items-center space-x-1 ${className}`}>
            <input
                type="number"
                min="0"
                value={minutes || ''}
                onChange={(e) => handleMinutesChange(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-16 px-2 py-1.5 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
            />
            <span className="text-gray-500 text-sm">min</span>
            <input
                type="number"
                min="0"
                max="59"
                value={seconds || ''}
                onChange={(e) => handleSecondsChange(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-16 px-2 py-1.5 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
            />
            <span className="text-gray-500 text-sm">seg</span>
        </div>
    )
}

export default DurationInput