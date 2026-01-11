import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Dog, Fish, Dumbbell, Flame, TrendingUp, Calendar,
    MapPin, Footprints, ChevronRight, Zap, Target, Award
} from 'lucide-react'
import { statsService } from '../services/statsService'
import { userService } from '../services/userService'
import type { UserStatsResponse } from '../types/stats'
import type { User } from '../types/user'
import type { WorkoutType } from '../types/workout'
import { getErrorMessage } from '../services/errorHandler'

type HomePageProps = {
    userId: number | null
}

const workoutConfig: Record<WorkoutType, { icon: typeof Dog; color: string; bg: string; label: string }> = {
    RUN: { icon: Dog, color: 'text-green-500', bg: 'bg-green-50', label: 'Run' },
    SWIM: { icon: Fish, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Swim' },
    GYM: { icon: Dumbbell, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Gym' },
    HYROX: { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Hyrox' },
}

function HomePage({ userId }: HomePageProps) {
    const navigate = useNavigate()
    const [stats, setStats] = useState<UserStatsResponse | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (userId) {
            loadData()
        } else {
            setLoading(false)
        }
    }, [userId])

    const loadData = async () => {
        if (!userId) return

        try {
            setLoading(true)
            setError(null)

            const [statsData, userData] = await Promise.all([
                statsService.getStats(userId),
                userService.getById(userId),
            ])

            setStats(statsData)
            setUser(userData)
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const formatDuration = (seconds: number | null) => {
        if (!seconds || seconds === 0) return '-'
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)

        if (hours > 0) {
            return `${hours}h ${mins}min`
        }
        return `${mins}min`
    }

    const formatDistance = (meters: number | null) => {
        if (!meters || meters === 0) return '-'
        return `${(meters / 1000).toFixed(1)} km`
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Hoy'
        if (diffDays === 1) return 'Ayer'
        if (diffDays < 7) return `Hace ${diffDays} días`

        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    }

    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Zap className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">¡Bienvenido a Hyron!</h2>
                <p className="text-gray-500 mb-6">Selecciona un usuario para comenzar</p>
            </div>
        )
    }

    // Cargando
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-500">Cargando...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Saludo */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    ¡Hola, {user?.name?.split(' ')[0] || 'Atleta'}! 👋
                </h1>
                <p className="text-gray-500">
                    {stats && stats.totalWorkouts > 0
                        ? `${stats.totalWorkouts} entrenamientos registrados`
                        : 'Comienza a registrar tus entrenamientos'
                    }
                </p>
            </div>

            {/* Resumen semanal */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span className="font-medium">Esta semana</span>
                    </div>
                    <TrendingUp className="w-5 h-5 opacity-75" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-3xl font-bold">{stats?.workoutsThisWeek || 0}</p>
                        <p className="text-sm text-white/75">Entrenos</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">{formatDuration(stats?.totalDurationSecondsThisWeek ?? null)}</p>
                        <p className="text-sm text-white/75">Tiempo</p>
                    </div>
                </div>

                {/* Distancias separadas */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/20">
                    <div className="flex items-center">
                        <Dog className="w-4 h-4 mr-2 opacity-75" />
                        <div>
                            <p className="text-lg font-semibold">{formatDistance(stats?.totalRunDistanceMetersThisWeek ?? null)}</p>
                            <p className="text-xs text-white/60">Corriendo</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Fish className="w-4 h-4 mr-2 opacity-75" />
                        <div>
                            <p className="text-lg font-semibold">{formatDistance(stats?.totalSwimDistanceMetersThisWeek ?? null)}</p>
                            <p className="text-xs text-white/60">Nadando</p>
                        </div>
                    </div>
                </div>

                {/* Desglose por tipo */}
                {stats && stats.workoutsThisWeek > 0 && (
                    <div className="flex items-center justify-center space-x-3 mt-4 pt-3 border-t border-white/20">
                        {Object.entries(stats.workoutsByTypeThisWeek).map(([type, count]) => {
                            if (count === 0) return null
                            const config = workoutConfig[type as WorkoutType]
                            const Icon = config.icon
                            return (
                                <div key={type} className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                                    <Icon className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">{count}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Accesos rápidos */}
            <div>
                <h2 className="text-sm font-semibold text-gray-500 mb-3">Nuevo entrenamiento</h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(workoutConfig).map(([type, config]) => {
                        const Icon = config.icon
                        return (
                            <button
                                key={type}
                                onClick={() => navigate(`/new/${type.toLowerCase()}`)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:bg-gray-50 flex flex-col items-center text-center"
                            >
                                <div className={`p-2.5 rounded-lg ${config.bg} mb-2`}>
                                    <Icon className={`w-7 h-7 ${config.color}`} />
                                </div>

                                <span className="text-sm font-medium text-gray-800">{config.label}</span>
                                <span className="text-xs text-gray-500 mt-0.5">Nuevo</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Último workout */}
            {stats?.lastWorkout && (
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 mb-3">Último entrenamiento</h2>
                    <button
                        onClick={() => navigate('/workouts')}
                        className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center hover:bg-gray-50 transition-colors"
                    >
                        <div className={`p-3 rounded-lg ${workoutConfig[stats.lastWorkout.type].bg} mr-4`}>
                            {(() => {
                                const Icon = workoutConfig[stats.lastWorkout.type].icon
                                return <Icon className={`w-6 h-6 ${workoutConfig[stats.lastWorkout.type].color}`} />
                            })()}
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-medium text-gray-800">
                                {workoutConfig[stats.lastWorkout.type].label}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                                <span>{formatDate(stats.lastWorkout.startDateTime)}</span>
                                {stats.lastWorkout.location && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <MapPin className="w-3 h-3 mr-1" />
                                        <span>{stats.lastWorkout.location}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            )}

            {/* Zapatillas más usadas */}
            {stats?.topShoes && stats.topShoes.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-gray-500">Mis zapatillas</h2>
                        <button
                            onClick={() => navigate('/shoes')}
                            className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                            Ver todas
                        </button>
                    </div>
                    <div className="space-y-3">
                        {stats.topShoes.map(shoe => (
                            <div key={shoe.id} className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <Footprints className="w-5 h-5 text-gray-400 mr-2" />
                                        <span className="font-medium text-gray-800">
                                            {shoe.nickname || `${shoe.brand} ${shoe.model}`}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {formatDistance(shoe.totalDistanceMeters)}
                                    </span>
                                </div>
                                {shoe.maxDistanceMeters && shoe.percentageUsed !== null && (
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                            <span>Desgaste</span>
                                            <span>{Math.round(shoe.percentageUsed)}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${shoe.percentageUsed >= 100
                                                    ? 'bg-red-500'
                                                    : shoe.percentageUsed >= 80
                                                        ? 'bg-orange-500'
                                                        : 'bg-green-500'
                                                    }`}
                                                style={{ width: `${Math.min(shoe.percentageUsed, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Totales históricos */}
            {stats && stats.totalWorkouts > 0 && (
                <div>
                    <div className="flex items-center mb-3">
                        <Award className="w-5 h-5 text-gray-400 mr-2" />
                        <h2 className="text-sm font-semibold text-gray-500">Total histórico</h2>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{stats.totalWorkouts}</p>
                                <p className="text-xs text-gray-500">Entrenos</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">
                                    {formatDuration(stats.totalDurationSeconds)}
                                </p>
                                <p className="text-xs text-gray-500">Tiempo total</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-center">
                                <Dog className="w-4 h-4 text-green-500 mr-2" />
                                <div className="text-center">
                                    <p className="text-lg font-semibold text-gray-800">
                                        {formatDistance(stats.totalRunDistanceMeters)}
                                    </p>
                                    <p className="text-xs text-gray-500">Corriendo</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <Fish className="w-4 h-4 text-blue-500 mr-2" />
                                <div className="text-center">
                                    <p className="text-lg font-semibold text-gray-800">
                                        {formatDistance(stats.totalSwimDistanceMeters)}
                                    </p>
                                    <p className="text-xs text-gray-500">Nadando</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Resumen mensual */}
            {stats && stats.workoutsThisMonth > 0 && (
                <div>
                    <div className="flex items-center mb-3">
                        <Target className="w-5 h-5 text-gray-400 mr-2" />
                        <h2 className="text-sm font-semibold text-gray-500">Este mes</h2>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{stats.workoutsThisMonth}</p>
                                <p className="text-xs text-gray-500">Entrenos</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">
                                    {formatDuration(stats.totalDurationSecondsThisMonth)}
                                </p>
                                <p className="text-xs text-gray-500">Tiempo</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-center">
                                <Dog className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-sm text-gray-600">
                                    {formatDistance(stats.totalRunDistanceMetersThisMonth)}
                                </span>
                            </div>
                            <div className="flex items-center justify-center">
                                <Fish className="w-4 h-4 text-blue-500 mr-2" />
                                <span className="text-sm text-gray-600">
                                    {formatDistance(stats.totalSwimDistanceMetersThisMonth)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sin entrenamientos */}
            {stats && stats.totalWorkouts === 0 && (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-700 mb-1">¡Empieza a entrenar!</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Registra tu primer entrenamiento para ver tus estadísticas
                    </p>
                    <button
                        onClick={() => navigate('/new/run')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Crear entrenamiento
                    </button>
                </div>
            )}
        </div>
    )
}

export default HomePage