import { useState, useEffect } from 'react'
import { Dog, Waves, Dumbbell, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import ActivityHeader from '../components/ui/ActivityHeader'
import WeekCalendar from '../components/ui/WeekCalendar'
import DistanceInput from '../components/ui/DistanceInput'
import TimeRoller from '../components/ui/TimeRoller'
import DurationCard from '../components/ui/DurationCard'
import ElevationCard from '../components/ui/ElevationCard'
import HeartRateInput from '../components/ui/HeartRateInput'
import ShoeSelector from '../components/ui/ShoeSelector'

import type { ShoeSummaryResponse } from '../types/shoe'
import { shoeService } from '../services/shoeService'


type Props = {
    userId: number | null
}

type ShoePlus = ShoeSummaryResponse & {
    image?: string | null     // URL de la foto
    distance: number          // Metros acumulados
    maxDistance?: number      // Vida útil en metros (default: 800km)
}

export default function TestCalendarPage({ userId }: Props) {
    const navigate = useNavigate()

    const [runDate, setRunDate] = useState(new Date())
    const [swimDate, setSwimDate] = useState(new Date())
    const [gymDate, setGymDate] = useState(new Date())
    const [hyroxDate, setHyroxDate] = useState(new Date())

    const [simpleDistance, setSimpleDistance] = useState(0)
    const [swimDistance, setSwimDistance] = useState(0)
    const [hyroxDistance, setHyroxDistance] = useState(0)
    const [simpleDuration, setSimpleDuration] = useState(23)
    const [simpleElevation, setSimpleElevation] = useState<number | null>(null)
    const [simpleHr, setSimpleHr] = useState<number | null>(null)

    const [duration1, setDuration1] = useState(3900)
    const [duration2, setDuration2] = useState(300)
    const [duration3, setDuration3] = useState(390)
    const [duration4, setDuration4] = useState(0)


    const [selectedShoeId, setSelectedShoeId] = useState<number | null>(null)
    const [shoes, setShoes] = useState<ShoeSummaryResponse[]>([])

    const loadShoes = async () => {
        if (!userId) return
        try {
            const data = await shoeService.getActiveSummary(userId)
            setShoes(data)
        } catch (err) {
            console.error('Error loading shoes:', err)
        }
    }

    useEffect(() => {
        if (userId) {
            loadShoes()
        }
    }, [userId])

    return (
        <div className="min-h-screen bg-gray-100 space-y-10 pb-10">

            {/* =========== SHOE SELECTOR =========== */}

            <div className="max-w-md mx-auto bg-white shadow-sm rounded-xl overflow-hidden">
                <ShoeSelector
                    shoes={shoes}
                    selectedShoeId={selectedShoeId}
                    onSelectShoe={setSelectedShoeId}
                    onAddShoe={() => navigate('/shoes')}
                    color="hyrox"
                />
            </div>

            {/* =========== INPUT TIME =========== */}

            {/* SECCIÓN DE MÉTRICAS */}
            <div className="space-y-3 px-4"> {/* Stack vertical con separación */}

                {/* 1. TIEMPO (Fila propia, full width) */}
                <DurationCard
                    value={simpleDuration}
                    onChange={setSimpleDuration}
                    format="ss" // ¡Ahora puedes usar segundos sin miedo!
                    color="hyrox"     // O 'blue' si fuera natación
                    label="Duración Total"
                />

                {/* 2. OTRAS MÉTRICAS (Podemos agrupar Desnivel y HR en una fila si quieres ahorrar espacio vertical, o dejarlos solos) */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Columna Izquierda: Desnivel */}
                    <ElevationCard
                        value={simpleElevation}
                        onChange={setSimpleElevation}
                        color="green"
                    />

                    {/* Columna Derecha: FC Media */}
                    <HeartRateInput
                        value={simpleHr}
                        onChange={setSimpleHr}
                        label="FC Media"
                        color="purple"
                        placeholder="140"
                    />
                </div>

            </div>

            {/* =========== RUN TEST =========== */}
            <div className="max-w-md mx-auto bg-white shadow-sm rounded-xl overflow-hidden">
                <ActivityHeader
                    title="Rodaje"
                    subtitle="Carrera continua"
                    label="RUNNING"
                    icon={Dog}
                    color="green"
                />

                <div>
                    <p>...</p>
                </div>

                <ActivityHeader
                    title="Rodaje"
                    subtitle="Carrera continua"
                    label="RUNNING"
                    icon={Dog}
                    color="green"
                    compact
                />

                <WeekCalendar
                    selectedDate={runDate}
                    onSelectDate={setRunDate}
                    color="green"
                />

                {/* Debug */}
                <div className="p-4 text-sm text-gray-600">
                    Fecha seleccionada (Run):{' '}
                    <span className="font-semibold">
                        {runDate.toLocaleDateString('es-ES')}
                    </span>
                </div>
            </div>

            {/* =========== SWIM TEST =========== */}
            <div className="max-w-md mx-auto bg-white shadow-sm rounded-xl overflow-hidden">
                <ActivityHeader
                    title="Natación"
                    subtitle="Piscina 25m"
                    label="SWIMMING"
                    icon={Waves}
                    color="blue"
                />

                <div>
                    <p>...</p>
                </div>

                <ActivityHeader
                    title="Natación"
                    subtitle="Piscina 25m"
                    label="SWIMMING"
                    icon={Waves}
                    color="blue"
                    compact
                />

                <WeekCalendar
                    selectedDate={swimDate}
                    onSelectDate={setSwimDate}
                    color="blue"
                />

                {/* Debug */}
                <div className="p-4 text-sm text-gray-600">
                    Fecha seleccionada (Swim):{' '}
                    <span className="font-semibold">
                        {swimDate.toLocaleDateString('es-ES')}
                    </span>
                </div>
            </div>

            {/* =========== GYM =========== */}
            <div className="max-w-md mx-auto bg-white shadow-sm rounded-xl overflow-hidden">
                <ActivityHeader
                    title="Gimnasio"
                    subtitle="Fuerza / Pesas"
                    label="GYM"
                    icon={Dumbbell}
                    color="purple"
                />

                <div>
                    <p>...</p>
                </div>

                <ActivityHeader
                    title="Gimnasio"
                    subtitle="Fuerza / Pesas"
                    label="GYM"
                    icon={Dumbbell}
                    color="purple"
                    compact
                />

                <WeekCalendar selectedDate={gymDate} onSelectDate={setGymDate} color="purple" />

                {/* Debug */}
                <div className="p-4 text-sm text-gray-600">
                    Fecha seleccionada (Gym):{' '}
                    <span className="font-semibold">{gymDate.toLocaleDateString('es-ES')}</span>
                </div>
            </div>

            {/* =========== HYROX =========== */}
            <div className="max-w-md mx-auto bg-white shadow-sm rounded-xl overflow-hidden">
                <ActivityHeader
                    title="Hyrox"
                    subtitle="Functional fitness"
                    label="HYROX"
                    icon={Trophy}
                    color="hyrox"
                />

                <div>
                    <p>...</p>
                </div>

                <ActivityHeader
                    title="Hyrox"
                    subtitle="Functional fitness"
                    label="HYROX"
                    icon={Trophy}
                    color="hyrox"
                    compact
                />

                <WeekCalendar selectedDate={hyroxDate} onSelectDate={setHyroxDate} color="hyrox" />

                {/* Debug */}
                <div className="p-4 text-sm text-gray-600">
                    Fecha seleccionada (Hyrox):{' '}
                    <span className="font-semibold">{hyroxDate.toLocaleDateString('es-ES')}</span>
                </div>
            </div>

            {/* =========== DISTANCE INPUT =========== */}
            <div>
                <DistanceInput
                    value={simpleDistance}
                    onChange={setSimpleDistance}
                    color='green'
                    mode='long'
                    step={100}
                /*para ultras podría cambiarlo presets={[50, 80, 100, 160]} */
                />
            </div>

            {/* =========== SWIM INPUT =========== */}
            <div>
                <DistanceInput
                    value={swimDistance}
                    onChange={setSwimDistance}
                    color='blue'
                    mode='short'
                    step={25}
                />
            </div>

            {/* =========== HYROX INPUT (Ski/Row) =========== */}
            <div>
                {/* Título opcional para contexto */}
                <div className="mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Estación Hyrox (Ski/Row)
                </div>

                <DistanceInput
                    value={hyroxDistance} // Asumiendo que creas este estado
                    onChange={setHyroxDistance}
                    color='hyrox'
                    mode='short'       // "1000 m" se lee mejor en contexto de gym que "1.00 km"
                    step={50}         // Saltos lógicos para series
                    presets={[500, 1000, 1500, 2000, 5000]} // Distancias típicas de entreno
                    max={10000}        // Nadie rema más de 10k en un entreno normal de Hyrox
                />
            </div>

            {/* =========== TIME1 =========== */}
            <div>
                {/* Título opcional para contexto */}
                <div className="mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Run
                </div>


                <TimeRoller
                    value={duration1}
                    onChange={setDuration1}
                    format="hh:mm"
                    color="green"
                />

            </div>

            {/* =========== TIME2 =========== */}
            <div>
                {/* Título opcional para contexto */}
                <div className="mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Gym Set / Descanso (Solo Segundos)
                </div>


                <TimeRoller
                    value={duration2}
                    onChange={setDuration2}
                    format="mm:ss"
                    color="blue"
                />

            </div>

            {/* =========== TIME3 =========== */}
            <div>
                {/* Título opcional para contexto */}
                <div className="mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Total
                </div>


                <TimeRoller
                    value={duration3}
                    onChange={setDuration3}
                    format="hh:mm:ss"
                    color="purple"
                />

            </div>

            {/* =========== TIME3 =========== */}
            <div>
                {/* Título opcional para contexto */}
                <div className="mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    solo sec
                </div>


                <TimeRoller
                    value={duration4}
                    onChange={setDuration4}
                    format="ss"
                    color="purple"
                />

            </div>



        </div>
    )
}
