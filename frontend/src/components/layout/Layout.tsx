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
            <Header
                selectedUserId={selectedUserId}
                onUserChange={onUserChange}
            />

            <main className="pt-16 pb-24 px-4">
                {children}
            </main>

            <BottomNav />
        </div>
    )
}

export default Layout