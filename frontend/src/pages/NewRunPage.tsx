import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dog, ArrowLeft, Save, AlertCircle } from 'lucide-react'
import { workoutService } from '../services/workoutService'
import { runService } from '../services/runService'
import type { RunDetailsCreateRequest, RunIntervalRequest } from '../types/run'

type NewRunPageProps = {
    userId: number | null
}

function NewRunPage({ userId }: NewRunPageProps) {
    const navigate = useNavigate()

    // --- ESTADOS DEL FORMULARIO ---

    // 1. Datos Comunes (Workout)
    const [startDateTime, setStartDateTime] = useState(new Date().toISOString().slice(0, 16))
    const [globalRpe, setGlobalRpe] = useState('')
    const [notes, setNotes] = useState('')
    const [location, setLocation] = useState('')

    // 2. Datos Específicos (Run)
    const [distanceKm, setDistanceKm] = useState('')
    const [durationMin, setDurationMin] = useState('')
    const [heartRate, setHeartRate] = useState('')

    // 3. Estados de UI
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Validar usuario
    if (!userId) {
        return <div className="p-8 text-center text-gray-500">Selecciona un usuario primero</div>
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validaciones básicas
        if (!startDateTime) { setError('La fecha es obligatoria'); return; }
        if (!distanceKm) { setError('La distancia es obligatoria'); return; }
        if (!durationMin) { setError('La duración es obligatoria'); return; }

        try {
            setLoading(true)

            // 1. Crear Workout Padre (Igual que antes)
            const workout = await workoutService.create(userId, {
                type: 'RUN',
                startDateTime: new Date(startDateTime).toISOString(),
                globalRpe: globalRpe ? parseInt(globalRpe) : null,
                notes: notes || null,
                location: location || null
            })

            // 2. Preparar los datos para Run Details
            const totalMeters = parseFloat(distanceKm) * 1000;
            const totalSeconds = parseFloat(durationMin) * 60;
            const avgHr = heartRate ? parseInt(heartRate) : undefined; // undefined para que JSON lo omita si está vacío

            // TRUCO: Creamos un "Intervalo Único" que representa toda la sesión
            // Esto satisface el requisito @NotEmpty de tu backend
            const singleInterval: RunIntervalRequest = {
                type: 'WORK', // Asumimos que todo fue trabajo
                durationSeconds: totalSeconds,
                distanceMeters: totalMeters,
                averageHr: avgHr,
                cadenceSpm: undefined, // No lo pedimos en el form simple
                elevationGain: 0,      // No lo pedimos en el form simple
                notes: "Sesión completa (auto-generado)"
            };

            const runDetailsData: RunDetailsCreateRequest = {
                totalDistanceMeters: totalMeters,
                totalElevationGain: 0,
                averageHr: avgHr,
                shoeId: undefined, // Todavía no tenemos selector de zapatillas
                notes: undefined,       // Las notas generales van en el Workout, no en el detalle (según tu UI actual)
                intervals: [singleInterval] // 👈 AQUÍ CUMPLIMOS CON EL BACKEND
            };

            // 3. Enviar al Backend (PUT)
            await runService.save(userId, workout.id, runDetailsData);

            navigate('/workouts')

        } catch (err) {
            console.error(err)
            setError('Error al guardar el entrenamiento. Revisa los datos.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-green-50 min-h-screen -m-4 pb-20"> {/* Fondo temático */}

            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-3 text-gray-500 hover:text-gray-800">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center text-green-700">
                        <Dog className="w-6 h-6 mr-2" />
                        <h1 className="text-xl font-bold">Nuevo Run</h1>
                    </div>
                </div>
            </div>

            <main className="p-4 max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center text-sm">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    )}

                    {/* SECCIÓN 1: DATOS ESPECÍFICOS (Lo más importante primero) */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100 space-y-4">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Métricas</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Distancia (km)</label>
                                <input
                                    type="number" step="0.01"
                                    value={distanceKm} onChange={e => setDistanceKm(e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                                    placeholder="5.0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo (min)</label>
                                <input
                                    type="number" step="1"
                                    value={durationMin} onChange={e => setDurationMin(e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                                    placeholder="25"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pulso Medio (bpm)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-red-400">❤</span>
                                <input
                                    type="number"
                                    value={heartRate} onChange={e => setHeartRate(e.target.value)}
                                    className="w-full p-3 pl-10 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
                                    placeholder="150"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: DATOS GENERALES */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Detalles Generales</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
                            <input
                                type="datetime-local"
                                value={startDateTime} onChange={e => setStartDateTime(e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">RPE (1-10)</label>
                                <input
                                    type="number" min="1" max="10"
                                    value={globalRpe} onChange={e => setGlobalRpe(e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
                                    placeholder="7"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                                <input
                                    type="text"
                                    value={location} onChange={e => setLocation(e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Parque..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                            <textarea
                                rows={3}
                                value={notes} onChange={e => setNotes(e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 resize-none"
                                placeholder="Sensaciones..."
                            />
                        </div>
                    </div>

                    {/* BOTÓN GUARDAR */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 hover:bg-green-700 transition-all flex justify-center items-center disabled:opacity-70 disabled:shadow-none"
                    >
                        {loading ? 'Guardando...' : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Guardar Entrenamiento
                            </>
                        )}
                    </button>

                </form>
            </main>
        </div>
    )
}

export default NewRunPage