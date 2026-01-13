import { Dumbbell, Footprints, Settings } from 'lucide-react'
import MenuItem from './MenuItem'

type ProfileMenuProps = {
    onGoExercises: () => void
    onGoShoes: () => void
    onGoSettings: () => void
}

function ProfileMenu({ onGoExercises, onGoShoes, onGoSettings }: ProfileMenuProps) {
    return (
        <div className="px-4 mb-8">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Gestión</h2>

            <div className="flex flex-col rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
                <MenuItem
                    icon={Dumbbell}
                    title="Mis Ejercicios"
                    subtitle="Catálogo personalizado"
                    onClick={onGoExercises}
                />

                <MenuItem
                    icon={Footprints}
                    title="Mis Zapatillas"
                    subtitle="Control de material"
                    onClick={onGoShoes}
                />

                <MenuItem
                    icon={Settings}
                    title="Configuración"
                    subtitle="Preferencias de la app"
                    onClick={onGoSettings}
                />
            </div>
        </div>
    )
}

export default ProfileMenu
