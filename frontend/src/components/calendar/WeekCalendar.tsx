import { useEffect, useMemo, useState } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ColorVariant } from '../../types/ui'

/* =========================
   Types
========================= */

/**
 * Props del componente {@link WeekCalendar}.
 */
type WeekCalendarProps = {
    /**
     * Fecha actualmente seleccionada (controlada por el padre).
     *
     * Se compara a nivel de día (dd/mm/yyyy), ignorando hora/minutos/segundos.
     */
    selectedDate: Date

    /**
     * Callback invocado cuando el usuario selecciona un día.
     *
     * Se dispara tanto al:
     * - Pulsar un día de la semana.
     * - Elegir fecha desde el selector nativo (input type="date").
     *
     * @param date Fecha seleccionada.
     */
    onSelectDate: (date: Date) => void

    /**
     * Variante visual (tema) para colores de selección/hover/hoy.
     *
     * @default 'green'
     */
    color?: ColorVariant
}

/* =========================
   Constants
========================= */

/**
 * Etiquetas cortas de los días (lunes → domingo).
 * Se asume semana ISO (lunes como primer día).
 */
const DAYS_SHORT = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

/**
 * Nombres de meses para el label superior (es-ES).
 */
const MONTHS = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
]

/* =========================
   Theme
========================= */

/**
 * Mapa de estilos por tema.
 *
 * Importante:
 * - Las clases Tailwind se declaran de forma estática para que el compilador las incluya.
 * - Evita generar clases dinámicas que Tailwind no pueda detectar.
 */
const THEME: Record<ColorVariant, Record<string, string>> = {
    green: {
        selectedBg: 'bg-green-500',
        selectedText: 'text-white',
        selectedShadow: 'shadow-green-200',
        todayText: 'text-green-600',
        todayRing: 'ring-green-200',
        todayBg: 'bg-green-50',
        dot: 'bg-green-400',
        hoverText: 'group-hover:text-green-600',
        buttonToday: 'bg-green-50 text-green-700 hover:bg-green-100'
    },
    blue: {
        selectedBg: 'bg-blue-500',
        selectedShadow: 'shadow-blue-200',
        selectedText: 'text-white',
        todayText: 'text-blue-600',
        todayRing: 'ring-blue-200',
        todayBg: 'bg-blue-50',
        dot: 'bg-blue-400',
        hoverText: 'group-hover:text-blue-600',
        buttonToday: 'bg-blue-50 text-blue-700 hover:bg-blue-100'
    },
    purple: {
        selectedBg: 'bg-purple-600',
        selectedText: 'text-white',
        selectedShadow: 'shadow-purple-200',
        todayText: 'text-purple-700',
        todayRing: 'ring-purple-200',
        todayBg: 'bg-purple-50',
        dot: 'bg-purple-500',
        hoverText: 'group-hover:text-purple-700',
        buttonToday: 'bg-purple-50 text-purple-800 hover:bg-purple-100'
    },
    hyrox: {
        selectedBg: 'bg-yellow-400',
        selectedText: 'text-black',
        selectedShadow: 'shadow-black/20',
        todayText: 'text-yellow-800',
        todayRing: 'ring-yellow-400',
        todayBg: 'bg-yellow-100',
        dot: 'bg-black',
        hoverText: 'group-hover:text-yellow-800',
        buttonToday: 'bg-yellow-400 text-black hover:bg-yellow-500'
    }
}

/* =========================
   Helpers
========================= */

/**
 * Compara dos fechas a nivel de “día calendario” (ignora hora/minutos/segundos).
 *
 * @param d1 Fecha 1.
 * @param d2 Fecha 2.
 * @returns `true` si representan el mismo día (mismo dd/mm/yyyy).
 */
const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()

/* =========================
   Component
========================= */

/**
 * Calendario semanal mobile-first (lunes → domingo) con navegación por semanas y selección de fecha.
 *
 * Características:
 * - Semana ISO (lunes a domingo).
 * - Navegación por semanas mediante botones y gesto de swipe horizontal.
 * - Selector de fecha mediante `input[type="date"]` invisible (clicando el label del mes).
 * - Botón “Hoy” cuando la fecha actual no está dentro de la semana visible.
 *
 * Modelo de estado:
 * - `selectedDate` es controlado por el componente padre.
 * - `viewDate` es estado interno y determina qué semana se muestra (independiente de la selección).
 * - Cuando `selectedDate` cambia desde fuera, el componente sincroniza `viewDate` para mantener la UI coherente.
 */
function WeekCalendar({ selectedDate, onSelectDate, color = 'green' }: WeekCalendarProps) {
    /**
     * Fecha de “vista”: determina qué semana se renderiza.
     * Se sincroniza con `selectedDate` cuando éste cambia externamente.
     */
    const [viewDate, setViewDate] = useState(() => new Date(selectedDate))

    /**
     * Estado para detección de swipe (navegación por semanas).
     *
     * - `touchStart`: X inicial.
     * - `touchEnd`: X final (actualizada en move si es gesto horizontal).
     * - `touchStartY`: Y inicial, para bloquear cuando predomina el scroll vertical.
     */
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)
    const [touchStartY, setTouchStartY] = useState<number | null>(null)

    /** Fecha actual del sistema (para marcador de “hoy”). */
    const today = new Date()

    /** Estilos derivados del tema. */
    const styles = THEME[color]

    /**
     * Mantiene la vista alineada cuando el padre cambia la fecha seleccionada.
     * Útil para cambios externos (por ejemplo, al cambiar la entidad/workout seleccionado).
     */
    useEffect(() => {
        setViewDate(new Date(selectedDate))
    }, [selectedDate])

    /**
     * Fechas (7) de la semana visible (lunes → domingo) para la semana que contiene `viewDate`.
     *
     * Nota: `Date#getDay()` devuelve 0 para domingo.
     * - Si es domingo (0), offset a lunes = -6
     * - Si es lunes (1), offset = 0
     * - etc.
     */
    const weekDays = useMemo(() => {
        const current = new Date(viewDate)
        const currentDay = current.getDay()
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay

        const monday = new Date(current)
        monday.setDate(current.getDate() + mondayOffset)

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday)
            date.setDate(monday.getDate() + i)
            return date
        })
    }, [viewDate])

    /**
     * Texto del mes/año mostrado en el header.
     *
     * Contempla semanas que cruzan:
     * - Mes (ej. ene → feb)
     * - Año (ej. dic 2025 → ene 2026)
     */
    const getMonthLabel = () => {
        const firstDay = weekDays[0]
        const lastDay = weekDays[6]

        if (firstDay.getMonth() === lastDay.getMonth()) {
            return `${MONTHS[firstDay.getMonth()]} ${firstDay.getFullYear()}`
        }

        if (firstDay.getFullYear() !== lastDay.getFullYear()) {
            return `${MONTHS[firstDay.getMonth()].slice(0, 3)} ${firstDay.getFullYear()} - ${MONTHS[
                lastDay.getMonth()
            ].slice(0, 3)} ${lastDay.getFullYear()}`
        }

        return `${MONTHS[firstDay.getMonth()].slice(0, 3)} - ${MONTHS[lastDay.getMonth()].slice(0, 3)} ${firstDay.getFullYear()}`
    }

    /**
     * Maneja el selector nativo de fecha (`input[type="date"]`) superpuesto al label del mes.
     *
     * Convierte el valor `YYYY-MM-DD` a `Date` en hora local.
     */
    const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return
        const [year, month, day] = e.target.value.split('-').map(Number)
        const newDate = new Date(year, month - 1, day)
        setViewDate(newDate)
        onSelectDate(newDate)
    }

    /**
     * Desplaza la semana visible una semana hacia atrás o hacia delante.
     *
     * Nota:
     * - Solo cambia `viewDate` (vista), no fuerza selección.
     * - La selección (`selectedDate`) la controla el padre.
     */
    const moveWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(viewDate)
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
        setViewDate(newDate)
    }

    /**
     * Determina si el día de hoy está dentro de la semana visible.
     * Si no lo está, se muestra el botón “Hoy”.
     */
    const isCurrentWeekVisible = weekDays.some((date) => isSameDay(date, today))

    /**
     * Salta a la fecha actual y la selecciona.
     * Convención del componente: “ver hoy” = “seleccionar hoy”.
     */
    const goToToday = () => {
        const now = new Date()
        setViewDate(now)
        onSelectDate(now)
    }

    /** Umbral mínimo de swipe horizontal en píxeles. */
    const minSwipeDistance = 50

    /**
     * Inicializa el gesto:
     * - Guarda las coordenadas iniciales X e Y.
     * - Resetea `touchEnd` para recalcular el desplazamiento.
     */
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
        setTouchStartY(e.targetTouches[0].clientY)
    }

    /**
     * Actualiza el gesto:
     * - Si el desplazamiento vertical domina, se interpreta como scroll y se ignora para swipe.
     * - Si el desplazamiento horizontal domina, se actualiza `touchEnd` para calcular dirección.
     */
    const onTouchMove = (e: React.TouchEvent) => {
        if (touchStart === null || touchStartY === null) return

        const currentX = e.targetTouches[0].clientX
        const currentY = e.targetTouches[0].clientY

        const diffX = Math.abs(touchStart - currentX)
        const diffY = Math.abs(touchStartY - currentY)

        // Si se desplaza más vertical que horizontal, permitimos scroll nativo (sin swipe).
        if (diffY > diffX) return

        setTouchEnd(currentX)
    }

    /**
     * Finaliza el gesto y aplica la navegación si se supera el umbral mínimo.
     *
     * - Swipe izquierda → semana siguiente
     * - Swipe derecha → semana anterior
     */
    const onTouchEnd = () => {
        if (touchStart === null || touchEnd === null) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe) moveWeek('next')
        if (isRightSwipe) moveWeek('prev')

        setTouchStart(null)
        setTouchStartY(null)
        setTouchEnd(null)
    }

    return (
        <div
            // `touch-pan-y` permite scroll vertical nativo y reserva el gesto horizontal para JS.
            className="bg-white border-b border-gray-100 pb-3 pt-2 select-none touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="relative flex items-center justify-center mb-3 px-4 h-8">
                <div className="flex items-center gap-1 sm:gap-2 z-10">
                    <button
                        onClick={() => moveWeek('prev')}
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                        aria-label="Semana anterior"
                        type="button"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="relative group cursor-pointer">
                        <span
                            className={`text-sm font-bold text-gray-700 capitalize w-32 text-center block ${styles.hoverText} transition-colors`}
                        >
                            {getMonthLabel()}
                        </span>

                        {/* Input invisible: abre el datepicker nativo al pulsar el label. */}
                        <input
                            type="date"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            onChange={handleDateSelect}
                            aria-label="Seleccionar fecha"
                        />
                    </div>

                    <button
                        onClick={() => moveWeek('next')}
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                        aria-label="Semana siguiente"
                        type="button"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {!isCurrentWeekVisible && (
                    <button
                        onClick={goToToday}
                        className={`absolute right-2 sm:right-4 flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full transition-all animate-in fade-in zoom-in duration-200 ${styles.buttonToday}`}
                        type="button"
                    >
                        <CalendarIcon className="w-3 h-3" />
                        Hoy
                    </button>
                )}
            </div>

            <div className="flex justify-between items-center px-4">
                {weekDays.map((date, index) => {
                    const isDateToday = isSameDay(date, today)
                    const isSelected = isSameDay(date, selectedDate)

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => onSelectDate(date)}
                            className="flex flex-col items-center w-10 group relative"
                            aria-pressed={isSelected}
                            aria-label={`Seleccionar ${date.toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}`}
                        >
                            <span
                                className={`text-[10px] font-medium mb-1 transition-colors 
                                    ${isSelected ? 'text-black font-bold' : 'text-gray-400'}
                                `}
                            >
                                {DAYS_SHORT[index]}
                            </span>

                            <div
                                className={`
                                w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200
                                    ${isSelected
                                        ? `${styles.selectedBg} ${styles.selectedText} shadow-md ${styles.selectedShadow} scale-105`
                                        : isDateToday
                                            ? `${styles.todayBg} ${styles.todayText} ring-1 ${styles.todayRing}`
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }
                                `}
                            >
                                {date.getDate()}
                            </div>

                            {isDateToday && !isSelected && (
                                <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${styles.dot}`} />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default WeekCalendar
