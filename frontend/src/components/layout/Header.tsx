import UserSelector from './UserSelector'
import { ThemeToggle } from '../ui/ThemeToggle';

type HeaderProps = {
    selectedUserId: number | null
    onUserChange: (userId: number) => void
}

function Header({ selectedUserId, onUserChange }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="flex items-center justify-between h-14 px-4">
                <h1 className="text-lg font-bold text-gray-800">Hyron</h1>
                <ThemeToggle />
                <UserSelector
                    selectedUserId={selectedUserId}
                    onUserChange={onUserChange}
                />
            </div>
        </header>
    )
}

export default Header