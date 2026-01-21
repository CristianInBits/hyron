import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`
        relative p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand
        ${theme === 'light'
                    ? 'bg-orange-100 text-orange-500 hover:bg-orange-200'
                    : 'bg-slate-800 text-blue-400 hover:bg-slate-700'
                }
      `}
            title={theme === 'light' ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
        >
            {/* Icono animado */}
            <div className="relative w-6 h-6">
                <Sun
                    className={`absolute inset-0 w-6 h-6 transition-transform duration-500 rotate-0 scale-100 
            ${theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : ''}`}
                />
                <Moon
                    className={`absolute inset-0 w-6 h-6 transition-transform duration-500 rotate-0 scale-0 opacity-0
            ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : ''}`}
                />
            </div>
        </button>
    );
}