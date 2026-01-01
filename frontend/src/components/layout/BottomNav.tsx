import { Link, useLocation } from 'react-router-dom';
import { Home, List, PlusCircle, User } from 'lucide-react';

function BottomNav() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    // Clases base
    const navItemClass = "flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-gray-900 transition-colors";
    const activeClass = "text-blue-600 font-medium";

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 z-50">
            <div className="grid grid-cols-4 h-full max-w-lg mx-auto">

                {/* 1. HOME */}
                <Link to="/" className={`${navItemClass} ${isActive('/') ? activeClass : ''}`}>
                    <Home size={24} />
                    <span className="text-[10px]">Home</span>
                </Link>

                {/* 2. WORKOUTS (Historial) */}
                <Link to="/workouts" className={`${navItemClass} ${isActive('/workouts') ? activeClass : ''}`}>
                    <List size={24} />
                    <span className="text-[10px]">Workouts</span>
                </Link>

                {/* 3. NUEVO (Botón Central Destacado) */}
                <Link to="/create" className={`${navItemClass} ${isActive('/create') ? 'text-blue-600' : ''}`}>
                    <PlusCircle size={32} className="text-blue-600 fill-blue-50" />
                    <span className="text-[10px] font-bold text-blue-600">Nuevo</span>
                </Link>

                {/* 4. PERFIL (Y Catálogos) */}
                <Link to="/profile" className={`${navItemClass} ${isActive('/profile') ? activeClass : ''}`}>
                    <User size={24} />
                    <span className="text-[10px]">Perfil</span>
                </Link>

            </div>
        </nav>
    )
}

export default BottomNav;