import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { useSupabase } from '../../hooks/useSupabase'
import { motion, AnimatePresence } from 'framer-motion'

interface ProfileProps {
  user: User
  onSignOut: () => void
}

export const ProfileIPhone = ({ user, onSignOut }: ProfileProps) => {
  const { user: profile, updateProfile } = useSupabase()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isIPhone, setIsIPhone] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const nameRef = useRef<HTMLInputElement>(null)
  const ageRef = useRef<HTMLInputElement>(null)
  const heightRef = useRef<HTMLInputElement>(null)
  const weightRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    age: profile?.age || 25,
    gender: profile?.gender || 'male' as 'male' | 'female',
    height: profile?.height || 175,
    weight: profile?.weight || 70,
    activityLevel: profile?.activityLevel || 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    goal: profile?.goal || 'maintain' as 'lose_weight' | 'maintain' | 'gain_muscle'
  })

  // Detect iPhone device
  useEffect(() => {
    const detectDevice = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      setIsIPhone(isIOS)
    }
    detectDevice()
  }, [])

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age || 25,
        gender: profile.gender || 'male',
        height: profile.height || 175,
        weight: profile.weight || 70,
        activityLevel: profile.activityLevel || 'moderate',
        goal: profile.goal || 'maintain'
      })
    }
  }, [profile])

  const handleSignOut = async () => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
    await supabase.auth.signOut()
    onSignOut()
  }

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError('Имя не может быть пустым')
      return
    }
    
    if (formData.age < 10 || formData.age > 120) {
      setError('Возраст должен быть от 10 до 120 лет')
      return
    }
    
    if (formData.height < 100 || formData.height > 250) {
      setError('Рост должен быть от 100 до 250 см')
      return
    }
    
    if (formData.weight < 30 || formData.weight > 300) {
      setError('Вес должен быть от 30 до 300 кг')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await updateProfile(formData)
      setEditing(false)
      setSuccess(true)
      
      // Success haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50])
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      setError(error.message || 'Ошибка при сохранении профиля')
      
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
    setError(null)
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setShowPasswordForm(false)
      setNewPassword('')
      setConfirmPassword('')
      setSuccess(true)
      
      // Success haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50])
      }
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      setError(error.message || 'Ошибка при изменении пароля')
      
      // Error haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputFocus = (ref: React.RefObject<HTMLInputElement>) => {
    // iOS Safari fix: prevent zoom
    if (isIPhone && ref.current) {
      ref.current.style.fontSize = '16px'
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden"
         style={{ 
           background: '#000000',
           minHeight: '100vh',
           paddingTop: isIPhone ? 'env(safe-area-inset-top, 0px)' : '0px',
           paddingBottom: isIPhone ? 'env(safe-area-inset-bottom, 0px)' : '0px',
         }}>
      
      {/* Optimized animated background for iPhone */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 95, 0, 0.15) 0%, transparent 70%)',
            width: '500px',
            height: '500px',
            left: '-150px',
            top: '-150px',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
            width: '400px',
            height: '400px',
            right: '-100px',
            bottom: '-100px',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Main profile container */}
      <motion.div 
        className="relative z-10 max-w-lg mx-auto p-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="relative"
             style={{
               background: isIPhone 
                 ? 'rgba(17, 17, 17, 0.98)' 
                 : 'rgba(255, 255, 255, 0.08)',
               backdropFilter: isIPhone ? 'none' : 'blur(20px)',
               WebkitBackdropFilter: isIPhone ? 'none' : 'blur(20px)',
               border: '1px solid rgba(255, 95, 0, 0.2)',
               borderRadius: '20px',
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
             }}>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-2xl opacity-20"
               style={{
                 background: 'radial-gradient(circle at 50% 0%, rgba(255, 95, 0, 0.08) 0%, transparent 50%)',
                 borderRadius: '20px',
               }} />
          
          <div className="relative p-6">
            {/* Header */}
            <motion.div 
              className="flex justify-between items-center mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                     style={{
                       background: 'linear-gradient(135deg, #FF5F00 0%, #FF8C00 100%)',
                       boxShadow: '0 8px 16px rgba(255, 95, 0, 0.25)',
                     }}>
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Профиль</h3>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <AnimatePresence mode="wait">
                  {editing ? (
                    <motion.div
                      key="edit-mode"
                      className="flex gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <motion.button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white relative overflow-hidden"
                        style={{
                          background: loading 
                            ? 'rgba(255, 95, 0, 0.3)' 
                            : 'linear-gradient(135deg, #FF5F00 0%, #FF8C00 100%)',
                          borderRadius: '12px',
                          minHeight: '44px',
                          boxShadow: '0 8px 20px rgba(255, 95, 0, 0.25)',
                          WebkitAppearance: 'none',
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: '0 12px 28px rgba(255, 95, 0, 0.35)',
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
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
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
                      className="flex gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <motion.button
                        onClick={() => setEditing(true)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{
                          background: 'linear-gradient(135deg, #FF5F00 0%, #FF8C00 100%)',
                          borderRadius: '12px',
                          minHeight: '44px',
                          boxShadow: '0 8px 20px rgba(255, 95, 0, 0.25)',
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: '0 12px 28px rgba(255, 95, 0, 0.35)',
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Редактировать
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Success/Error messages */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="mb-4 p-3 rounded-xl"
                  style={{
                    background: 'rgba(52, 199, 89, 0.1)',
                    border: '1px solid rgba(52, 199, 89, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <p className="text-green-400 text-sm text-center font-medium">✅ Успешно сохранено!</p>
                </motion.div>
              )}
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="mb-4 p-3 rounded-xl"
                  style={{
                    background: 'rgba(255, 59, 48, 0.1)',
                    border: '1px solid rgba(255, 59, 48, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile content */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {editing ? (
                  <motion.div
                    key="edit-form"
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Name field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-gray-300">Имя</label>
                      <input
                        ref={nameRef}
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onFocus={() => handleInputFocus(nameRef)}
                        className="w-full px-4 py-3 rounded-xl border-none focus:outline-none transition-all duration-300 text-white placeholder-gray-500"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          fontSize: '16px',
                          borderRadius: '12px',
                          minHeight: '48px',
                          WebkitAppearance: 'none',
                        }}
                        placeholder="Ваше имя"
                      />
                    </motion.div>

                    {/* Age and Gender */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-sm font-medium mb-2 text-gray-300">Возраст</label>
                        <input
                          ref={ageRef}
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                          onFocus={() => handleInputFocus(ageRef)}
                          className="w-full px-4 py-3 rounded-xl border-none focus:outline-none transition-all duration-300 text-white"
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            fontSize: '16px',
                            borderRadius: '12px',
                            minHeight: '48px',
                            WebkitAppearance: 'none',
                          }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="block text-sm font-medium mb-2 text-gray-300">Пол</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                          className="w-full px-4 py-3 rounded-xl border-none focus:outline-none transition-all duration-300 text-white"
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            fontSize: '16px',
                            borderRadius: '12px',
                            minHeight: '48px',
                            WebkitAppearance: 'none',
                          }}
                        >
                          <option value="male" style={{ background: '#1a1a1a' }}>Мужской</option>
                          <option value="female" style={{ background: '#1a1a1a' }}>Женский</option>
                        </select>
                      </motion.div>
                    </div>

                    {/* Height and Weight */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="block text-sm font-medium mb-2 text-gray-300">Рост (см)</label>
                        <input
                          ref={heightRef}
                          type="number"
                          step="0.1"
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                          onFocus={() => handleInputFocus(heightRef)}
                          className="w-full px-4 py-3 rounded-xl border-none focus:outline-none transition-all duration-300 text-white"
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            fontSize: '16px',
                            borderRadius: '12px',
                            minHeight: '48px',
                            WebkitAppearance: 'none',
                          }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <label className="block text-sm font-medium mb-2 text-gray-300">Вес (кг)</label>
                        <input
                          ref={weightRef}
                          type="number"
                          step="0.1"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                          onFocus={() => handleInputFocus(weightRef)}
                          className="w-full px-4 py-3 rounded-xl border-none focus:outline-none transition-all duration-300 text-white"
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            fontSize: '16px',
                            borderRadius: '12px',
                            minHeight: '48px',
                            WebkitAppearance: 'none',
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Activity Level and Goal */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <label className="block text-sm font-medium mb-2 text-gray-300">Активность</label>
                        <select
                          value={formData.activityLevel}
                          onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
                          className="w-full px-4 py-3 rounded-xl border-none focus:outline-none transition-all duration-300 text-white"
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            fontSize: '16px',
                            borderRadius: '12px',
                            minHeight: '48px',
                            WebkitAppearance: 'none',
                          }}
                        >
                          <option value="sedentary" style={{ background: '#1a1a1a' }}>Сидячий</option>
                          <option value="light" style={{ background: '#1a1a1a' }}>Легкая</option>
                          <option value="moderate" style={{ background: '#1a1a1a' }}>Умеренная</option>
                          <option value="active" style={{ background: '#1a1a1a' }}>Активная</option>
                          <option value="very_active" style={{ background: '#1a1a1a' }}>Очень</option>
                        </select>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <label className="block text-sm font-medium mb-2 text-gray-300">Цель</label>
                        <select
                          value={formData.goal}
                          onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
                          className="w-full px-4 py-3 rounded-xl border-none focus:outline-none transition-all duration-300 text-white"
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            fontSize: '16px',
                            borderRadius: '12px',
                            minHeight: '48px',
                            WebkitAppearance: 'none',
                          }}
                        >
                          <option value="lose_weight" style={{ background: '#1a1a1a' }}>Похудение</option>
                          <option value="maintain" style={{ background: '#1a1a1a' }}>Поддержание</option>
                          <option value="gain_muscle" style={{ background: '#1a1a1a' }}>Мышцы</option>
                        </select>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view-mode"
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[
                      { label: 'Имя', value: profile?.name || 'Не указано' },
                      { label: 'Возраст', value: `${profile?.age || 'Не указано'} лет` },
                      { label: 'Пол', value: profile?.gender === 'male' ? 'Мужской' : 'Женский' },
                      { label: 'Рост', value: `${profile?.height || 'Не указано'} см` },
                      { label: 'Вес', value: `${profile?.weight || 'Не указано'} кг` },
                      { 
                        label: 'Активность', 
                        value: profile?.activityLevel === 'sedentary' ? 'Сидячий' :
                               profile?.activityLevel === 'light' ? 'Легкая' :
                               profile?.activityLevel === 'moderate' ? 'Умеренная' :
                               profile?.activityLevel === 'active' ? 'Активная' : 'Очень активная'
                      },
                      { 
                        label: 'Цель', 
                        value: profile?.goal === 'lose_weight' ? 'Похудение' :
                               profile?.goal === 'maintain' ? 'Поддержание' : 'Набор мышц'
                      },
                    ].map((field, index) => (
                      <motion.div
                        key={field.label}
                        className="flex justify-between items-center p-3 rounded-xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <span className="text-gray-400 text-sm">{field.label}</span>
                        <span className="text-white font-medium">{field.value}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Password change section */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <AnimatePresence>
                {showPasswordForm ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <h4 className="text-white font-medium">Изменить пароль</h4>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-none focus:outline-none transition-all duration-300 text-white placeholder-gray-500"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        fontSize: '16px',
                        borderRadius: '12px',
                        minHeight: '48px',
                        WebkitAppearance: 'none',
                      }}
                      placeholder="Новый пароль"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-none focus:outline-none transition-all duration-300 text-white placeholder-gray-500"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        fontSize: '16px',
                        borderRadius: '12px',
                        minHeight: '48px',
                        WebkitAppearance: 'none',
                      }}
                      placeholder="Подтвердите пароль"
                    />
                    <div className="flex gap-2">
                      <motion.button
                        onClick={handlePasswordChange}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                        style={{
                          background: loading 
                            ? 'rgba(255, 95, 0, 0.3)' 
                            : 'linear-gradient(135deg, #FF5F00 0%, #FF8C00 100%)',
                          borderRadius: '12px',
                          minHeight: '44px',
                        }}
                        whileHover={{ 
                          scale: 1.02,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? 'Сохранение...' : 'Изменить пароль'}
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setShowPasswordForm(false)
                          setNewPassword('')
                          setConfirmPassword('')
                          setError(null)
                        }}
                        className="px-4 py-3 rounded-xl text-sm font-semibold text-white"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          minHeight: '44px',
                        }}
                        whileHover={{ 
                          scale: 1.02,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Отмена
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-gray-400"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px dashed rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      minHeight: '44px',
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      background: 'rgba(255, 255, 255, 0.08)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🔐 Изменить пароль
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Sign out button */}
            <motion.div 
              className="mt-6 pt-6 border-t border-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.button
                onClick={handleSignOut}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, #FF3B30 0%, #FF2D20 100%)',
                  borderRadius: '12px',
                  minHeight: '44px',
                  boxShadow: '0 8px 20px rgba(255, 59, 48, 0.25)',
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 12px 28px rgba(255, 59, 48, 0.35)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                Выйти из аккаунта
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
