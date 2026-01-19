import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { User } from '@supabase/supabase-js'
import Layout from './components/Layout'
import { AuthIPhone } from './components/Auth/AuthIPhone'
import { ProfileIPhone } from './components/Auth/ProfileIPhone'
import { Home } from './pages/Home'
import { Calculator } from './pages/Calculator'
import { Workouts } from './pages/Workouts'
import { Nutrition } from './pages/Nutrition'
import { Progress } from './pages/Progress'
import { Analytics } from './pages/Analytics'
import { ResetPassword } from './pages/ResetPassword'

function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Проверяем текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Слушаем изменения аутентификации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!user) {
    return <AuthIPhone onAuthChange={setUser} />
  }

  return (
    <Layout user={user}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<ProfileIPhone user={user} onSignOut={() => setUser(null)} />} />
      </Routes>
    </Layout>
  )
}

export default App
