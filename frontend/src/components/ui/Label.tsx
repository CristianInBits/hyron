import { forwardRef, type LabelHTMLAttributes } from 'react'

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
                {...props}
            >
                {children}
            </label>
        )
    }
)

Label.displayName = 'Label'