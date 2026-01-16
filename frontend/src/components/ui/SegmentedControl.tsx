type Option<T extends string> = {
    value: T
    label: string
}

type SegmentedControlProps<T extends string> = {
    value: T
    options: Option<T>[]
    onChange: (v: T) => void
}

export function SegmentedControl<T extends string>({
    value,
    options,
    onChange,
}: SegmentedControlProps<T>) {
    return (
        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
            {options.map((opt) => {
                const active = opt.value === value
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={`
                            px-3 py-1.5 text-sm font-medium rounded-md transition-all
                            ${active
                                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
                            }
                        `}
                    >
                        {opt.label}
                    </button>
                )
            })}
        </div>
    )
}