import { Input } from './Input'

type Variant = 'default' | 'green' | 'blue' | 'purple' | 'orange'

type DurationInputProps = {
    value: number
    onChange: (seconds: number) => void
    className?: string
    inputClassName?: string
    variant?: Variant
}

function DurationInput({
    value,
    onChange,
    className = '',
    inputClassName = '',
    variant = 'default'
}: DurationInputProps) {

    const minutes = Math.floor(value / 60)
    const seconds = value % 60

    const handleMinutesChange = (mins: number) => {
        onChange(mins * 60 + seconds)
    }

    const handleSecondsChange = (secs: number) => {
        const validSecs = Math.min(59, Math.max(0, secs))
        onChange(minutes * 60 + validSecs)
    }

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <Input
                type="number"
                min="0"
                variant={variant}
                value={minutes || ''}
                onChange={(e) => handleMinutesChange(parseInt(e.target.value) || 0)}
                placeholder="0"
                className={`w-16 text-center px-1 ${inputClassName}`}
            />
            <span className="text-gray-500 text-sm">min</span>

            <Input
                type="number"
                min="0"
                max="59"
                variant={variant}
                value={seconds || ''}
                onChange={(e) => handleSecondsChange(parseInt(e.target.value) || 0)}
                placeholder="0"
                className={`w-16 text-center px-1 ${inputClassName}`}
            />
            <span className="text-gray-500 text-sm">seg</span>
        </div>
    )
}

export default DurationInput