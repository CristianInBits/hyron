import Header from './Header'
import BottomNav from './BottomNav'

type LayoutProps = {
    children: React.ReactNode
    selectedUserId: number | null
    onUserChange: (userId: number) => void
}

function Layout({ children, selectedUserId, onUserChange }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header fijo arriba */}
            <Header
                selectedUserId={selectedUserId}
                onUserChange={onUserChange}
            />

            {/* Contenido principal */}
            <main className="pt-14 pb-24 px-4">
                {children}
            </main>

            {/* Navegación inferior */}
            <BottomNav />
        </div>
    )
}

export default Layout