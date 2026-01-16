import { Medal, Trophy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Achievement = {
    id: number
    title: string
    value: string
    icon: LucideIcon
    color: string
    bg: string
}

type AchievementsSectionProps = {
    achievements: Achievement[]
    onViewHistoryClick?: () => void
}

function AchievementsSection({ achievements, onViewHistoryClick }: AchievementsSectionProps) {
    return (
        <div className="px-4 mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Medallas y Logros</h2>

                <button
                    type="button"
                    onClick={onViewHistoryClick}
                    className="text-xs text-blue-600 font-medium cursor-pointer hover:underline"
                >
                    Ver historial
                </button>
            </div>

            {/* Tarjeta destacada */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all">
                <div className="relative z-10">
                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Último Hito</p>
                    <h3 className="text-lg font-bold text-gray-800">Media Maratón</h3>

                    <div className="flex items-center mt-2 text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-md w-fit">
                        <Medal className="w-3 h-3 mr-1" />
                        Finisher
                    </div>
                </div>

                {/* Decoración */}
                <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent opacity-50" />
                <div className="p-3 bg-gray-50 rounded-full text-gray-400 group-hover:text-yellow-500 group-hover:bg-yellow-50 transition-colors z-10">
                    <Trophy className="w-8 h-8" />
                </div>
            </div>

            {/* Grid de logros */}
            <div className="grid grid-cols-3 gap-3 mt-3">
                {achievements.map((ach) => {
                    const Icon = ach.icon

                    return (
                        <div
                            key={ach.id}
                            className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2 hover:border-gray-200 transition-colors"
                        >
                            <div className={`p-2 rounded-full ${ach.bg} ${ach.color}`}>
                                <Icon className="w-4 h-4" />
                            </div>

                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold leading-tight">{ach.title}</p>
                                <p className="font-bold text-gray-800 text-xs mt-0.5">{ach.value}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AchievementsSection
