import BottomNav from './BottomNav'

type LayoutProps = {
    children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Contenido principal */}
            <main className="pb-24 p-4">
                {children}
            </main>

            {/* Navegación inferior */}
            <BottomNav />
        </div>
    )
}

export default Layout