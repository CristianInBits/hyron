import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Fish, Plus, ArrowLeft, Save, Timer, BarChart3 } from 'lucide-react'
import { swimService } from '../services/swimService'
import { workoutService } from '../services/workoutService'
import type { SwimDetailsCreateRequest, PoolType, SwimIntervalType, SwimStroke } from '../types/swim'
import { poolTypeLabels } from '../types/swim'
import SwimIntervalForm from '../components/swim/SwimIntervalForm'
import type { SwimIntervalFormData } from '../components/swim/SwimIntervalForm'
import DurationInput from '../components/ui/DurationInput'
import { getErrorMessage } from '../services/errorHandler'

type NewSwimPageProps = {
    userId: number | null
}

type SwimMode = 'simple' | 'intervals'

const poolTypes: PoolType[] = ['SHORT_COURSE', 'LONG_COURSE', 'OPEN_WATER', 'OTHER']

const emptyInterval: SwimIntervalFormData = {
    type: 'WORK',
    stroke: 'FREESTYLE',
    distanceMeters: null,
    durationSeconds: null,
    restSeconds: null,
    rpe: null,
    equipment: [],
    notes: '',
}

function NewSwimPage({ userId }: NewSwimPageProps) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const workoutIdParam = searchParams.get('workoutId')

    // Modo del formulario
    const [mode, setMode] = useState<SwimMode | null>(null)

    // Estado para modo simple
    const [simpleDistance, setSimpleDistance] = useState('')
    const [simpleDuration, setSimpleDuration] = useState(0)
    const [simpleStroke, setSimpleStroke] = useState<SwimStroke>('FREESTYLE')

    // Estado para modo intervalos
    const [intervals, setIntervals] = useState<SwimIntervalFormData[]>([{ ...emptyInterval }])

    // Estado compartido
    const [poolType, setPoolType] = useState<PoolType>('SHORT_COURSE')
    const [notes, setNotes] = useState('')
    const [workoutId, setWorkoutId] = useState<number | null>(workoutIdParam ? parseInt(workoutIdParam) : null)
    const [workoutDate, setWorkoutDate] = useState<string>(() => {
        const now = new Date()
        return now.toISOString().slice(0, 16)
    })

    // Estado de UI
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (userId) {
            loadInitialData()
        }
    }, [userId, workoutIdParam])

    const loadInitialData = async () => {
        if (!userId) return

        try {
            setLoadingData(true)

            if (workoutIdParam) {
                const wId = parseInt(workoutIdParam)
                setWorkoutId(wId)

                // Cargar datos del workout base
                try {
                    const workoutData = await workoutService.getById(userId, wId)
                    setWorkoutDate(workoutData.startDateTime.slice(0, 16))
                } catch {
                    // Si falla, usar fecha actual
                }

                try {
                    const details = await swimService.getDetails(userId, wId)
                    setPoolType(details.poolType)
                    setNotes(details.notes ?? '')

                    if (details.intervals.length === 1) {
                        setMode('simple')
                        const interval = details.intervals[0]
                        setSimpleDistance(interval.distanceMeters?.toString() ?? '')
                        setSimpleDuration(interval.durationSeconds ?? 0)
                        setSimpleStroke(interval.stroke)
                    } else if (details.intervals.length > 1) {
                        setMode('intervals')
                        setIntervals(details.intervals.map(i => ({
                            type: i.type,
                            stroke: i.stroke,
                            distanceMeters: i.distanceMeters,
                            durationSeconds: i.durationSeconds,
                            restSeconds: i.restSeconds,
                            rpe: i.rpe,
                            equipment: i.equipment,
                            notes: i.notes ?? '',
                        })))
                    }
                } catch {
                    // No hay detalles aún
                }
            }
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoadingData(false)
        }
    }

    const handleAddInterval = () => {
        setIntervals([...intervals, { ...emptyInterval }])
    }

    const handleUpdateInterval = (index: number, interval: SwimIntervalFormData) => {
        const updated = [...intervals]
        updated[index] = interval
        setIntervals(updated)
    }

    const handleRemoveInterval = (index: number) => {
        setIntervals(intervals.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (!userId || !mode) return

        try {
            setLoading(true)
            setError(null)

            let requestIntervals: SwimDetailsCreateRequest['intervals'] = []

            if (mode === 'simple') {
                if (!simpleDistance && simpleDuration === 0) {
                    setError('Introduce distancia o duración')
                    setLoading(false)
                    return
                }

                requestIntervals = [{
                    type: 'WORK' as SwimIntervalType,
                    stroke: simpleStroke,
                    distanceMeters: simpleDistance ? parseInt(simpleDistance) : null,
                    durationSeconds: simpleDuration || null,
                }]
            } else {
                const validIntervals = intervals.filter(i => i.distanceMeters || i.durationSeconds)
                if (validIntervals.length === 0) {
                    setError('Añade al menos un intervalo con distancia o duración')
                    setLoading(false)
                    return
                }

                requestIntervals = validIntervals.map(i => ({
                    type: i.type,
                    stroke: i.stroke,
                    distanceMeters: i.distanceMeters,
                    durationSeconds: i.durationSeconds,
                    restSeconds: i.restSeconds,
                    rpe: i.rpe,
                    equipment: i.equipment.length > 0 ? i.equipment : undefined,
                    notes: i.notes.trim() || null,
                }))
            }

            // Crear o actualizar workout
            let wId = workoutId
            if (!wId) {
                const workout = await workoutService.create(userId, {
                    type: 'SWIM',
                    startDateTime: new Date(workoutDate).toISOString(),
                })
                wId = workout.id
                setWorkoutId(wId)
            } else {
                await workoutService.update(userId, wId, {
                    startDateTime: new Date(workoutDate).toISOString(),
                })
            }

            // Calcular totales
            let totalDistance: number | null = null
            let totalTime: number | null = null

            if (mode === 'simple') {
                totalDistance = simpleDistance ? parseInt(simpleDistance) : null
                totalTime = simpleDuration || null
            } else {
                const distances = requestIntervals.map(i => i.distanceMeters ?? 0)
                const durations = requestIntervals.map(i => i.durationSeconds ?? 0)
                totalDistance = distances.reduce((a, b) => a + b, 0) || null
                totalTime = durations.reduce((a, b) => a + b, 0) || null
            }

            const request: SwimDetailsCreateRequest = {
                poolType,
                totalDistanceMeters: totalDistance,
                totalTimeSeconds: totalTime,
                notes: notes.trim() || null,
                intervals: requestIntervals,
            }

            await swimService.saveDetails(userId, wId, request)
            navigate('/workouts')
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    // Pantalla sin usuario
    if (!userId) {
        return (
            <div className="bg-blue-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <Fish className="w-10 h-10 mr-3 text-blue-600" />
                    <h1 className="text-2xl font-bold text-blue-700">Nuevo Swim</h1>
                </div>
                <p className="text-blue-600">Selecciona un usuario primero</p>
            </div>
        )
    }

    // Pantalla de carga
    if (loadingData) {
        return (
            <div className="bg-blue-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <Fish className="w-10 h-10 mr-3 text-blue-600" />
                    <h1 className="text-2xl font-bold text-blue-700">Nuevo Swim</h1>
                </div>
                <p className="text-blue-600">Cargando...</p>
            </div>
        )
    }

    // Pantalla de selección de modo
    if (!mode) {
        return (
            <div className="bg-blue-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/workouts')}
                        className="p-2 mr-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <Fish className="w-10 h-10 mr-3 text-blue-600" />
                    <h1 className="text-2xl font-bold text-blue-700">Nuevo Swim</h1>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        ¿Qué tipo de entrenamiento?
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setMode('simple')}
                            className="flex flex-col items-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors"
                        >
                            <Timer className="w-12 h-12 text-blue-500 mb-3" />
                            <span className="font-semibold text-blue-700">Simple</span>
                            <span className="text-sm text-blue-600 mt-1 text-center">Nado continuo</span>
                        </button>

                        <button
                            onClick={() => setMode('intervals')}
                            className="flex flex-col items-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors"
                        >
                            <BarChart3 className="w-12 h-12 text-blue-500 mb-3" />
                            <span className="font-semibold text-blue-700">Series</span>
                            <span className="text-sm text-blue-600 mt-1 text-center">Intervalos, técnica</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Formulario modo SIMPLE
    if (mode === 'simple') {
        return (
            <div className="bg-blue-50 min-h-screen -m-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => setMode(null)}
                            className="p-2 mr-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <Fish className="w-10 h-10 mr-3 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-blue-700">Nado continuo</h1>
                            <p className="text-sm text-blue-600">Entrenamiento simple</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5 mr-1" />
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Fecha */}
                <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha y hora del entrenamiento
                    </label>
                    <input
                        type="datetime-local"
                        value={workoutDate}
                        onChange={(e) => setWorkoutDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Formulario simple */}
                <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
                    {/* Tipo de piscina y Estilo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Piscina
                            </label>
                            <select
                                value={poolType}
                                onChange={(e) => setPoolType(e.target.value as PoolType)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                {poolTypes.map(pt => (
                                    <option key={pt} value={pt}>{poolTypeLabels[pt]}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estilo
                            </label>
                            <select
                                value={simpleStroke}
                                onChange={(e) => setSimpleStroke(e.target.value as SwimStroke)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="FREESTYLE">Crol</option>
                                <option value="BACKSTROKE">Espalda</option>
                                <option value="BREASTSTROKE">Braza</option>
                                <option value="BUTTERFLY">Mariposa</option>
                                <option value="MEDLEY">Estilos</option>
                            </select>
                        </div>
                    </div>

                    {/* Distancia y Duración */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Distancia (m)
                            </label>
                            <input
                                type="number"
                                value={simpleDistance}
                                onChange={(e) => setSimpleDistance(e.target.value)}
                                placeholder="2000"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duración
                            </label>
                            <DurationInput
                                value={simpleDuration}
                                onChange={setSimpleDuration}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notas
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Nado suave de recuperación..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        />
                    </div>
                </div>
            </div>
        )
    }

    // Formulario modo INTERVALOS
    return (
        <div className="bg-blue-50 min-h-screen -m-4 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button
                        onClick={() => setMode(null)}
                        className="p-2 mr-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <Fish className="w-10 h-10 mr-3 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-blue-700">Series</h1>
                        <p className="text-sm text-blue-600">Intervalos</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save className="w-5 h-5 mr-1" />
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Fecha */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha y hora del entrenamiento
                </label>
                <input
                    type="datetime-local"
                    value={workoutDate}
                    onChange={(e) => setWorkoutDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Datos generales */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Piscina
                        </label>
                        <select
                            value={poolType}
                            onChange={(e) => setPoolType(e.target.value as PoolType)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {poolTypes.map(pt => (
                                <option key={pt} value={pt}>{poolTypeLabels[pt]}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notas
                        </label>
                        <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Técnica de crol..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
            </div>

            {/* Intervalos */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-700">Intervalos</h2>
                    <button
                        type="button"
                        onClick={handleAddInterval}
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir
                    </button>
                </div>

                <div className="space-y-3">
                    {intervals.map((interval, index) => (
                        <SwimIntervalForm
                            key={index}
                            index={index}
                            interval={interval}
                            onChange={handleUpdateInterval}
                            onRemove={handleRemoveInterval}
                            canRemove={intervals.length > 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NewSwimPage