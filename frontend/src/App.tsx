import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import CreatePage from './pages/CreatePage'
import ProfilePage from './pages/ProfilePage'

// Placeholders
const HomePage = () => <div className="text-center mt-10">🏠 <br />Gráficas de la semana</div>;
const WorkoutsListPage = () => <div className="text-center mt-10">📋 <br />Listado de todos los entrenos</div>;

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workouts" element={<WorkoutsListPage />} />

        {/* Nueva página central */}
        <Route path="/create" element={<CreatePage />} />

        {/* Nuevo perfil */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Rutas futuras para los formularios de creación */}
        <Route path="/run/new" element={<div>Formulario Run</div>} />
        <Route path="/swim/new" element={<div>Formulario Swim</div>} />
        {/* etc... */}
      </Routes>
    </Layout>
  )
}

export default App;