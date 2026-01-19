import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { useSupabase } from '../../hooks/useSupabase'
import { motion, AnimatePresence } from 'framer-motion'

interface ProfileProps {
  user: User
  onSignOut: () => void
}

export const Profile = ({ user, onSignOut }: ProfileProps) => {
  const { user: profile, updateProfile } = useSupabase()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    age: profile?.age || 25,
    gender: profile?.gender || 'male' as 'male' | 'female',
    height: profile?.height || 175,
    weight: profile?.weight || 70,
    activityLevel: profile?.activityLevel || 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    goal: profile?.goal || 'maintain' as 'lose_weight' | 'maintain' | 'gain_muscle'
  })

  const handleSignOut = async () => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
    await supabase.auth.signOut()
    onSignOut()
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile(formData)
      setEditing(false)
      // Success haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50])
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      // Error haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      age: profile?.age || 25,
      gender: profile?.gender || 'male',
      height: profile?.height || 175,
      weight: profile?.weight || 70,
      activityLevel: profile?.activityLevel || 'moderate',
      goal: profile?.goal || 'maintain'
    })
    setEditing(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden"
         style={{ 
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           minHeight: '100vh',
         }}>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `rgba(255, 255, 255, ${0.02 + Math.random() * 0.03})`,
              filter: 'blur(60px)',
              width: `${150 + Math.random() * 250}px`,
              height: `${150 + Math.random() * 250}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [Math.random() * 50 - 25, Math.random() * 50 - 25],
              y: [Math.random() * 50 - 25, Math.random() * 50 - 25],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + Math.random() * 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main profile container */}
      <motion.div 
        className="relative z-10 max-w-2xl mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="rounded-3xl p-6 relative"
             style={{
               background: 'rgba(255, 255, 255, 0.1)',
               backdropFilter: 'blur(20px)',
               WebkitBackdropFilter: 'blur(20px)',
               border: '1px solid rgba(255, 255, 255, 0.2)',
               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
             }}>
          
          {/* Header */}
          <motion.div 
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-white">Профиль пользователя</h3>
            <div className="flex space-x-2">
              <AnimatePresence mode="wait">
                {editing ? (
                  <motion.div
                    key="edit-mode"
                    className="flex space-x-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <motion.button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white relative overflow-hidden"
                      style={{
                        background: loading 
                          ? 'rgba(255, 255, 255, 0.2)' 
                          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                        minHeight: '44px',
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 6px 25px rgba(16, 185, 129, 0.4)',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {loading ? (
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        'Сохранить'
                      )}
                    </motion.button>
                    <motion.button
                      onClick={handleCancel}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        minHeight: '44px',
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        background: 'rgba(255, 255, 255, 0.15)',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Отмена
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view-mode"
                    className="flex space-x-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <motion.button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                        minHeight: '44px',
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Редактировать
                    </motion.button>
                    <motion.button
                      onClick={handleSignOut}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                      style={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
                        minHeight: '44px',
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 6px 25px rgba(239, 68, 68, 0.4)',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Выйти
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Profile content */}
          <div className="space-y-6">
            {/* Email field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium mb-2 text-white/80">Email</label>
              <div className="text-white font-medium">{user.email}</div>
            </motion.div>

            <AnimatePresence mode="wait">
              {editing ? (
                <motion.div
                  key="edit-form"
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Name field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium mb-2 text-white/80">Имя</label>
                    <motion.input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border-none focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-white/60"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        fontSize: '16px',
                      }}
                      placeholder="Ваше имя"
                      whileFocus={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        scale: 1.02,
                      }}
                    />
                  </motion.div>

                  {/* Age and Gender */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-white/80">Возраст</label>
                      <motion.input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 rounded-2xl border-none focus:outline-none focus:ring-2 transition-all duration-300 text-white"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          fontSize: '16px',
                        }}
                        whileFocus={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          scale: 1.02,
                        }}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-white/80">Пол</label>
                      <motion.select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                        className="w-full px-4 py-3 rounded-2xl border-none focus:outline-none focus:ring-2 transition-all duration-300 text-white"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          fontSize: '16px',
                        }}
                        whileFocus={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          scale: 1.02,
                        }}
                      >
                        <option value="male" style={{ background: '#667eea' }}>Мужской</option>
                        <option value="female" style={{ background: '#667eea' }}>Женский</option>
                      </motion.select>
                    </motion.div>
                  </div>

                  {/* Height and Weight */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-white/80">Рост (см)</label>
                      <motion.input
                        type="number"
                        step="0.1"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 rounded-2xl border-none focus:outline-none focus:ring-2 transition-all duration-300 text-white"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          fontSize: '16px',
                        }}
                        whileFocus={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          scale: 1.02,
                        }}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-white/80">Вес (кг)</label>
                      <motion.input
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 rounded-2xl border-none focus:outline-none focus:ring-2 transition-all duration-300 text-white"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          fontSize: '16px',
                        }}
                        whileFocus={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          scale: 1.02,
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Activity Level and Goal */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-white/80">Уровень активности</label>
                      <motion.select
                        value={formData.activityLevel}
                        onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
                        className="w-full px-4 py-3 rounded-2xl border-none focus:outline-none focus:ring-2 transition-all duration-300 text-white"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          fontSize: '16px',
                        }}
                        whileFocus={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          scale: 1.02,
                        }}
                      >
                        <option value="sedentary" style={{ background: '#667eea' }}>Сидячий</option>
                        <option value="light" style={{ background: '#667eea' }}>Легкая активность</option>
                        <option value="moderate" style={{ background: '#667eea' }}>Умеренная активность</option>
                        <option value="active" style={{ background: '#667eea' }}>Активный</option>
                        <option value="very_active" style={{ background: '#667eea' }}>Очень активный</option>
                      </motion.select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-white/80">Цель</label>
                      <motion.select
                        value={formData.goal}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
                        className="w-full px-4 py-3 rounded-2xl border-none focus:outline-none focus:ring-2 transition-all duration-300 text-white"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          fontSize: '16px',
                        }}
                        whileFocus={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          scale: 1.02,
                        }}
                      >
                        <option value="lose_weight" style={{ background: '#667eea' }}>Похудение</option>
                        <option value="maintain" style={{ background: '#667eea' }}>Поддержание</option>
                        <option value="gain_muscle" style={{ background: '#667eea' }}>Набор мышц</option>
                      </motion.select>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="view-mode"
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Display fields */}
                  {[
                    { label: 'Имя', value: profile?.name || 'Не указано' },
                    { label: 'Возраст', value: profile?.age || 'Не указано' },
                    { label: 'Пол', value: profile?.gender === 'male' ? 'Мужской' : 'Женский' },
                    { label: 'Рост', value: `${profile?.height || 'Не указано'} см` },
                    { label: 'Вес', value: `${profile?.weight || 'Не указано'} кг` },
                    { 
                      label: 'Уровень активности', 
                      value: profile?.activityLevel === 'sedentary' ? 'Сидячий' :
                             profile?.activityLevel === 'light' ? 'Легкая активность' :
                             profile?.activityLevel === 'moderate' ? 'Умеренная активность' :
                             profile?.activityLevel === 'active' ? 'Активный' : 'Очень активный'
                    },
                    { 
                      label: 'Цель', 
                      value: profile?.goal === 'lose_weight' ? 'Похудение' :
                             profile?.goal === 'maintain' ? 'Поддержание' : 'Набор мышц'
                    },
                  ].map((field, index) => (
                    <motion.div
                      key={field.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-white/80">{field.label}</label>
                      <div className="text-white font-medium">{field.value}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Safe area padding for iPhone */}
        <div style={{ 
          height: 'env(safe-area-inset-bottom, 20px)',
          minHeight: '20px'
        }} />
      </motion.div>
    </div>
  )
}
