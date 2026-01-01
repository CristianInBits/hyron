import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import WorkoutsPage from './pages/WorkoutsPage'
import ProfilePage from './pages/ProfilePage'
import NewRunPage from './pages/NewRunPage'
import NewSwimPage from './pages/NewSwimPage'
import NewGymPage from './pages/NewGymPage'
import NewHyroxPage from './pages/NewHyroxPage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/new/run" element={<NewRunPage />} />
          <Route path="/new/swim" element={<NewSwimPage />} />
          <Route path="/new/gym" element={<NewGymPage />} />
          <Route path="/new/hyrox" element={<NewHyroxPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App