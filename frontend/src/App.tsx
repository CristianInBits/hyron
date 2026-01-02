import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import WorkoutsPage from './pages/WorkoutsPage'
import ProfilePage from './pages/ProfilePage'
import UsersPage from './pages/UsersPage'
import NewRunPage from './pages/NewRunPage'
import NewSwimPage from './pages/NewSwimPage'
import NewGymPage from './pages/NewGymPage'
import NewHyroxPage from './pages/NewHyroxPage'

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  return (
    <Layout
      selectedUserId={selectedUserId}
      onUserChange={setSelectedUserId}
    >
      <Routes>
        <Route path="/" element={<HomePage userId={selectedUserId} />} />
        <Route path="/workouts" element={<WorkoutsPage userId={selectedUserId} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/new/run" element={<NewRunPage userId={selectedUserId} />} />
        <Route path="/new/swim" element={<NewSwimPage userId={selectedUserId} />} />
        <Route path="/new/gym" element={<NewGymPage userId={selectedUserId} />} />
        <Route path="/new/hyrox" element={<NewHyroxPage userId={selectedUserId} />} />
      </Routes>
    </Layout>
  )
}

export default App