import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ProfileHeader from '../components/profile/ProfileHeader'
import AchievementsSection from '../components/profile/AchievementsSection'
import ProfileMenu from '../components/profile/ProfileMenu'
import LogoutButton from '../components/profile/LogoutButton'

import { userService } from '../services/userService'
import type { User as UserType } from '../types/user'

import { Medal, Trophy } from 'lucide-react'

const MOCK_ACHIEVEMENTS = [
    { id: 1, title: '10K Run', value: '48:00 PB', icon: Medal, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 2, title: '1km Swim', value: '25:30', icon: Medal, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 3, title: 'Hyrox Finisher', value: 'Full Race', icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-50' },
]

function ProfilePage() {
    const navigate = useNavigate()
    const [user, setUser] = useState<UserType | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await userService.getById(1)
                setUser(data)
            } catch (error) {
                console.error('Error cargando perfil', error)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [])

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Cargando perfil...</div>
    }

    if (!user) {
        return <div className="p-8 text-center text-gray-500">Usuario no encontrado</div>
    }

    const formattedDate = new Date(user.registeredAt).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="max-w-md mx-auto pb-10">
            <ProfileHeader
                user={user}
                formattedDate={formattedDate}
                onEditClick={() => console.log('Editar perfil')}
                isPro={true}
            />

            <AchievementsSection
                achievements={MOCK_ACHIEVEMENTS}
                onViewHistoryClick={() => console.log('Ver historial')}
            />

            <ProfileMenu
                onGoExercises={() => navigate('/exercises')}
                onGoShoes={() => navigate('/shoes')}
                onGoSettings={() => console.log('Ir a settings')}
            />

            <LogoutButton
                onLogout={() => console.log('Cerrar sesión')}
                version="1.0.0"
            />
        </div>
    )
}

export default ProfilePage