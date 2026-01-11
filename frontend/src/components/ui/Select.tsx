import { forwardRef, type SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  variant?: 'default' | 'green' | 'blue' | 'purple' | 'orange'
}

const baseClasses = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 disabled:opacity-50 disabled:bg-gray-50"

const variantClasses = {
  default: 'focus:ring-gray-200 focus:border-gray-400',
  green: 'focus:ring-green-200 focus:border-green-400',
  blue: 'focus:ring-blue-200 focus:border-blue-400',
  purple: 'focus:ring-purple-200 focus:border-purple-400',
  orange: 'focus:ring-orange-200 focus:border-orange-400',
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'