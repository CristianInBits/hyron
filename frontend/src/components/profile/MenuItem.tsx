import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type MenuItemProps = {
    icon: LucideIcon
    title: string
    subtitle?: string
    onClick: () => void
}

function MenuItem({ icon: Icon, title, subtitle, onClick }: MenuItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group first:rounded-t-xl last:rounded-b-xl"
        >
            <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <Icon className="w-5 h-5" />
                </div>

                <div className="text-left">
                    <h3 className="font-medium text-gray-800">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
                </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500" />
        </button>
    )
}

export default MenuItem
