import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Flame, Plus, ArrowLeft, Save, Zap } from 'lucide-react'
import { hyroxService } from '../services/hyroxService'
import { workoutService } from '../services/workoutService'
import type { HyroxDetailsCreateRequest, HyroxStation } from '../types/hyrox'
import HyroxBlockForm from '../components/hyrox/HyroxBlockForm'
import type { BlockFormData } from '../components/hyrox/HyroxBlockForm'
import type { ItemFormData } from '../components/hyrox/HyroxItemForm'
import { getErrorMessage } from '../services/errorHandler'

type NewHyroxPageProps = {
    userId: number | null
}

// Orden oficial de estaciones HYROX
const officialStations: HyroxStation[] = [
    'SKI_ERG',
    'SLED_PUSH',
    'SLED_PULL',
    'BURPEE_BROAD_JUMP',
    'ROW',
    'FARMERS_CARRY',
    'SANDBAG_LUNGES',
    'WALL_BALLS',
]

const createEmptyItem = (station: HyroxStation = 'RUN'): ItemFormData => ({
    station,
    durationSeconds: 0,
    recoveryDurationSeconds: null,
    distanceMeters: station === 'RUN' ? 1000 : null,
    reps: null,
    weightKg: null,
    averageHr: null,
    rpe: null,
    notes: '',
})

const createEmptyBlock = (): BlockFormData => ({
    restDurationSeconds: null,
    notes: '',
    items: [createEmptyItem('RUN')],
})

// Crear estructura de competición oficial (8 rondas: Run + Ejercicio)
const createOfficialStructure = (): BlockFormData[] => {
    return officialStations.map((station, index) => ({
        restDurationSeconds: null,
        notes: '',
        items: [
            createEmptyItem('RUN'),
            createEmptyItem(station),
        ],
    }))
}

function NewHyroxPage({ userId }: NewHyroxPageProps) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const workoutIdParam = searchParams.get('workoutId')

    // Estado del formulario
    const [workoutId, setWorkoutId] = useState<number | null>(workoutIdParam ? parseInt(workoutIdParam) : null)
    const [workoutDate, setWorkoutDate] = useState<string>(() => {
        const now = new Date()
        return now.toISOString().slice(0, 16)
    })
    const [notes, setNotes] = useState('')
    const [blocks, setBlocks] = useState<BlockFormData[]>([createEmptyBlock()])

    // Estado de UI
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showTemplateChoice, setShowTemplateChoice] = useState(!workoutIdParam)

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
                setShowTemplateChoice(false)

                // Cargar datos del workout base
                try {
                    const workoutData = await workoutService.getById(userId, wId)
                    setWorkoutDate(workoutData.startDateTime.slice(0, 16))
                } catch {
                    // Si falla, usar fecha actual
                }

                // Cargar detalles del hyrox
                try {
                    const details = await hyroxService.getDetails(userId, wId)
                    setNotes(details.notes ?? '')

                    if (details.blocks.length > 0) {
                        setBlocks(details.blocks.map(block => ({
                            restDurationSeconds: block.restDurationSeconds,
                            notes: block.notes ?? '',
                            items: block.items.map(item => ({
                                station: item.station,
                                durationSeconds: item.durationSeconds,
                                recoveryDurationSeconds: item.recoveryDurationSeconds,
                                distanceMeters: item.distanceMeters,
                                reps: item.reps,
                                weightKg: item.weightKg,
                                averageHr: item.averageHr,
                                rpe: item.rpe,
                                notes: item.notes ?? '',
                            })),
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

    const handleUseOfficialTemplate = () => {
        setBlocks(createOfficialStructure())
        setShowTemplateChoice(false)
    }

    const handleUseEmptyTemplate = () => {
        setBlocks([createEmptyBlock()])
        setShowTemplateChoice(false)
    }

    const handleAddBlock = () => {
        setBlocks([...blocks, createEmptyBlock()])
    }

    const handleUpdateBlock = (index: number, block: BlockFormData) => {
        const updated = [...blocks]
        updated[index] = block
        setBlocks(updated)
    }

    const handleRemoveBlock = (index: number) => {
        setBlocks(blocks.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (!userId) return

        // Validar que hay al menos un bloque con items válidos
        const validBlocks = blocks.filter(b => b.items.some(i => i.durationSeconds > 0))
        if (validBlocks.length === 0) {
            setError('Añade al menos una ronda con estaciones')
            return
        }

        try {
            setLoading(true)
            setError(null)

            // Crear o actualizar workout
            let wId = workoutId
            if (!wId) {
                const workout = await workoutService.create(userId, {
                    type: 'HYROX',
                    startDateTime: new Date(workoutDate).toISOString(),
                })
                wId = workout.id
                setWorkoutId(wId)
            } else {
                await workoutService.update(userId, wId, {
                    startDateTime: new Date(workoutDate).toISOString(),
                })
            }

            // Preparar request
            const request: HyroxDetailsCreateRequest = {
                notes: notes.trim() || null,
                blocks: validBlocks.map(block => ({
                    restDurationSeconds: block.restDurationSeconds,
                    notes: block.notes.trim() || null,
                    items: block.items
                        .filter(item => item.durationSeconds > 0)
                        .map(item => ({
                            station: item.station,
                            durationSeconds: item.durationSeconds,
                            recoveryDurationSeconds: item.recoveryDurationSeconds,
                            distanceMeters: item.distanceMeters,
                            reps: item.reps,
                            weightKg: item.weightKg,
                            averageHr: item.averageHr,
                            rpe: item.rpe,
                            notes: item.notes.trim() || null,
                        })),
                })),
            }

            await hyroxService.saveDetails(userId, wId, request)
            navigate('/workouts')
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    // Calcular tiempo total
    const totalTime = blocks.reduce((sum, block) => {
        const blockTime = block.items.reduce((s, item) => {
            return s + item.durationSeconds + (item.recoveryDurationSeconds ?? 0)
        }, 0)
        return sum + blockTime + (block.restDurationSeconds ?? 0)
    }, 0)

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // Pantalla sin usuario
    if (!userId) {
        return (
            <div className="bg-orange-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <Flame className="w-10 h-10 mr-3 text-orange-600" />
                    <h1 className="text-2xl font-bold text-orange-700">Nuevo Hyrox</h1>
                </div>
                <p className="text-orange-600">Selecciona un usuario primero</p>
            </div>
        )
    }

    // Pantalla de carga
    if (loadingData) {
        return (
            <div className="bg-orange-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <Flame className="w-10 h-10 mr-3 text-orange-600" />
                    <h1 className="text-2xl font-bold text-orange-700">Nuevo Hyrox</h1>
                </div>
                <p className="text-orange-600">Cargando...</p>
            </div>
        )
    }

    // Pantalla de selección de plantilla
    if (showTemplateChoice) {
        return (
            <div className="bg-orange-50 min-h-screen -m-4 p-4">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/workouts')}
                        className="p-2 mr-2 text-orange-600 hover:bg-orange-100 rounded-lg"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <Flame className="w-10 h-10 mr-3 text-orange-600" />
                    <h1 className="text-2xl font-bold text-orange-700">Nuevo Hyrox</h1>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        ¿Qué tipo de entrenamiento?
                    </h2>

                    <div className="space-y-4">
                        <button
                            onClick={handleUseOfficialTemplate}
                            className="w-full flex items-center p-4 bg-orange-50 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-colors"
                        >
                            <Zap className="w-10 h-10 text-orange-500 mr-4" />
                            <div className="text-left">
                                <span className="font-semibold text-orange-700 block">Competición oficial</span>
                                <span className="text-sm text-orange-600">8 rondas: 1km Run + Estación</span>
                            </div>
                        </button>

                        <button
                            onClick={handleUseEmptyTemplate}
                            className="w-full flex items-center p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-colors"
                        >
                            <Plus className="w-10 h-10 text-gray-500 mr-4" />
                            <div className="text-left">
                                <span className="font-semibold text-gray-700 block">Personalizado</span>
                                <span className="text-sm text-gray-600">Crear estructura desde cero</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-orange-50 min-h-screen -m-4 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/workouts')}
                        className="p-2 mr-2 text-orange-600 hover:bg-orange-100 rounded-lg"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <Flame className="w-10 h-10 mr-3 text-orange-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-orange-700">
                            {workoutId ? 'Editar Hyrox' : 'Nuevo Hyrox'}
                        </h1>
                        {totalTime > 0 && (
                            <p className="text-sm text-orange-600">Tiempo total: {formatTime(totalTime)}</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
            </div>

            {/* Notas generales */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas del entrenamiento (opcional)
                </label>
                <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Simulacro de competición, entrenamiento parcial..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
            </div>

            {/* Rondas/Bloques */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-700">Rondas</h2>
                    <button
                        type="button"
                        onClick={handleAddBlock}
                        className="flex items-center text-orange-600 hover:text-orange-700 text-sm"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir ronda
                    </button>
                </div>

                <div className="space-y-4">
                    {blocks.map((block, index) => (
                        <HyroxBlockForm
                            key={index}
                            index={index}
                            block={block}
                            onChange={handleUpdateBlock}
                            onRemove={handleRemoveBlock}
                            canRemove={blocks.length > 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NewHyroxPage