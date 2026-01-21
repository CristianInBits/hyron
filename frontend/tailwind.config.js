/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // <--- IMPORTANTE
    theme: {
        extend: {
            colors: {
                // Mapeamos las variables CSS a nombres de clases útiles
                page: 'rgb(var(--bg-page) / <alpha-value>)',
                surface: 'rgb(var(--bg-surface) / <alpha-value>)',
                main: 'rgb(var(--text-main) / <alpha-value>)',
                muted: 'rgb(var(--text-muted) / <alpha-value>)',
                border: 'rgb(var(--border-color) / <alpha-value>)',
                brand: 'rgb(var(--color-brand) / <alpha-value>)',
            }
        },
    },
    plugins: [],
}