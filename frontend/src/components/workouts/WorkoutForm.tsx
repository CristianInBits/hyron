import { useState, useEffect } from 'react'
import { Dog, Fish, Dumbbell, Flame } from 'lucide-react'
import type { WorkoutType, WorkoutCreateRequest, WorkoutDetailResponse } from '../../types/workout'
import { getErrorMessage } from '../../services/errorHandler'

type WorkoutFormProps = {
    workout?: WorkoutDetailResponse | null
    onSubmit: (data: WorkoutCreateRequest) => Promise<void>
    onCancel: () => void
}

const workoutTypes: { type: WorkoutType; icon: typeof Dog; color: string; bg: string; label: string }[] = [
    { type: 'RUN', icon: Dog, color: 'text-green-500', bg: 'bg-green-50', label: 'Run' },
    { type: 'SWIM', icon: Fish, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Swim' },
    { type: 'GYM', icon: Dumbbell, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Gym' },
    { type: 'HYROX', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Hyrox' },
]

function WorkoutForm({ workout, onSubmit, onCancel }: WorkoutFormProps) {
    const [type, setType] = useState<WorkoutType>('RUN')
    const [startDateTime, setStartDateTime] = useState('')
    const [endDateTime, setEndDateTime] = useState('')
    const [globalRpe, setGlobalRpe] = useState('')
    const [notes, setNotes] = useState('')
    const [location, setLocation] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (workout) {
            setType(workout.type)
            setStartDateTime(formatDateTimeLocal(workout.startDateTime))
            setEndDateTime(workout.endDateTime ? formatDateTimeLocal(workout.endDateTime) : '')
            setGlobalRpe(workout.globalRpe?.toString() || '')
            setNotes(workout.notes || '')
            setLocation(workout.location || '')
        } else {
            setType('RUN')
            setStartDateTime(formatDateTimeLocal(new Date().toISOString()))
            setEndDateTime('')
            setGlobalRpe('')
            setNotes('')
            setLocation('')
        }
    }, [workout])

    const formatDateTimeLocal = (isoString: string) => {
        const date = new Date(isoString)
        return date.toISOString().slice(0, 16)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!startDateTime) {
            setError('La fecha de inicio es obligatoria')
            return
        }

        try {
            setLoading(true)
            setError(null)
            await onSubmit({
                type,
                startDateTime: new Date(startDateTime).toISOString(),
                endDateTime: endDateTime ? new Date(endDateTime).toISOString() : null,
                globalRpe: globalRpe ? parseInt(globalRpe) : null,
                notes: notes.trim() || null,
                location: location.trim() || null,
            })
        } catch (err) {
            setError(getErrorMessage(err))
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Selector de tipo (solo en creación) */}
            {!workout && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de entrenamiento
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {workoutTypes.map(wt => {
                            const Icon = wt.icon
                            const isSelected = type === wt.type
                            return (
                                <button
                                    key={wt.type}
                                    type="button"
                                    onClick={() => setType(wt.type)}
                                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${isSelected
                                            ? `${wt.bg} border-current ${wt.color}`
                                            : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-medium">{wt.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Fecha inicio */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inicio
                </label>
                <input
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
            </div>

            {/* Fecha fin */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fin (opcional)
                </label>
                <input
                    type="datetime-local"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
            </div>

            {/* RPE y Ubicación en fila */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        RPE (1-10)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={globalRpe}
                        onChange={(e) => setGlobalRpe(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="7"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ubicación
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Gimnasio"
                    />
                </div>
            </div>

            {/* Notas */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                    placeholder="Notas del entrenamiento..."
                />
            </div>

            {/* Botones */}
            <div className="flex space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    )
}

export default WorkoutForm