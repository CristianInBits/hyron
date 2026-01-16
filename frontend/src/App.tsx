import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from './components/layout/Layout'

import { SettingsProvider } from './context/SettingsContext'

import {
  ExercisesPage,
  HomePage,
  NewGymPage,
  NewHyroxPage,
  NewRunPage,
  NewSwimPage,
  ProfilePage,
  ShoesPage,
  UsersPage,
  WorkoutsPage,
  SettingsPage
} from './pages'

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  return (
    <SettingsProvider>
      <Layout
        selectedUserId={selectedUserId}
        onUserChange={setSelectedUserId}
      >
        <Routes>
          <Route path="/" element={<HomePage userId={selectedUserId} />} />
          <Route path="/workouts" element={<WorkoutsPage userId={selectedUserId} />} />
          <Route path="/profile" element={<ProfilePage userId={selectedUserId} />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/shoes" element={<ShoesPage userId={selectedUserId} />} />
          <Route path="/exercises" element={<ExercisesPage userId={selectedUserId} />} />
          <Route path="/new/run" element={<NewRunPage userId={selectedUserId} />} />
          <Route path="/new/swim" element={<NewSwimPage userId={selectedUserId} />} />
          <Route path="/new/gym" element={<NewGymPage userId={selectedUserId} />} />
          <Route path="/new/hyrox" element={<NewHyroxPage userId={selectedUserId} />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </SettingsProvider>
  )
}

export default App