import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isIPhone, setIsIPhone] = useState(false)
  
  const navigate = useNavigate()

  useEffect(() => {
    const detectDevice = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      setIsIPhone(isIOS)
    }
    detectDevice()
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
      
      // Success haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50])
      }

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/')
      }, 2000)

    } catch (err: any) {
      setError(err.message)
      
      // Error haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
           style={{ 
             background: '#000000',
             minHeight: '100vh',
             paddingTop: isIPhone ? 'env(safe-area-inset-top, 0px)' : '0px',
             paddingBottom: isIPhone ? 'env(safe-area-inset-bottom, 0px)' : '0px',
           }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
          style={{
            background: 'rgba(17, 17, 17, 0.98)',
            padding: '3rem',
            borderRadius: '20px',
            border: '1px solid rgba(52, 199, 89, 0.2)',
            maxWidth: '400px',
            margin: '0 1rem',
          }}
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Пароль изменен!</h2>
          <p className="text-gray-400">Перенаправление на страницу входа...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ 
           background: '#000000',
           minHeight: '100vh',
           paddingTop: isIPhone ? 'env(safe-area-inset-top, 0px)' : '0px',
           paddingBottom: isIPhone ? 'env(safe-area-inset-bottom, 0px)' : '0px',
         }}>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(52, 199, 89, 0.1) 0%, transparent 70%)',
            width: '400px',
            height: '400px',
            left: '-100px',
            top: '-100px',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-sm mx-4"
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
               border: '1px solid rgba(52, 199, 89, 0.2)',
               borderRadius: '20px',
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
             }}>
          
          <div className="relative p-6">
            <motion.div 
              className="text-center mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
                     boxShadow: '0 12px 24px rgba(52, 199, 89, 0.25)',
                   }}>
                <span className="text-2xl">🔐</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">
                Новый пароль
              </h2>
              <p className="text-gray-400 text-sm">
                Создайте новый надежный пароль
              </p>
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
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

            <form onSubmit={handleResetPassword} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-xl border-none focus:outline-none transition-all duration-300 placeholder-transparent peer"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '16px',
                      borderRadius: '12px',
                      minHeight: '48px',
                      WebkitAppearance: 'none',
                    }}
                    placeholder="Новый пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label 
                    className="absolute left-4 top-3 text-gray-400 transition-all duration-300 pointer-events-none"
                    style={{
                      fontSize: '16px',
                      transform: password ? 'translateY(-22px) scale(0.8)' : 'translateY(0) scale(1)',
                      opacity: password ? 0.7 : 1,
                    }}
                  >
                    Новый пароль
                  </label>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative">
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-xl border-none focus:outline-none transition-all duration-300 placeholder-transparent peer"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '16px',
                      borderRadius: '12px',
                      minHeight: '48px',
                      WebkitAppearance: 'none',
                    }}
                    placeholder="Подтвердите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label 
                    className="absolute left-4 top-3 text-gray-400 transition-all duration-300 pointer-events-none"
                    style={{
                      fontSize: '16px',
                      transform: confirmPassword ? 'translateY(-22px) scale(0.8)' : 'translateY(0) scale(1)',
                      opacity: confirmPassword ? 0.7 : 1,
                    }}
                  >
                    Подтвердите пароль
                  </label>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white relative overflow-hidden"
                  style={{
                    background: loading 
                      ? 'rgba(52, 199, 89, 0.3)' 
                      : 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
                    borderRadius: '12px',
                    minHeight: '48px',
                    boxShadow: '0 8px 20px rgba(52, 199, 89, 0.25)',
                    WebkitAppearance: 'none',
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 12px 28px rgba(52, 199, 89, 0.35)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  ) : (
                    'Изменить пароль'
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
