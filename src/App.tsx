import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { Home } from './pages/Home'
import { Calculator } from './pages/Calculator'
import { Workouts } from './pages/Workouts'
import { Nutrition } from './pages/Nutrition'
import { Progress } from './pages/Progress'
import { Analytics } from './pages/Analytics'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Layout>
  )
}

export default App
