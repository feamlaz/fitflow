import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'

interface AuthProps {
  onAuthChange: (user: User | null) => void
}

export const Auth = ({ onAuthChange }: AuthProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Haptic feedback simulation
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        if (data.user) {
          onAuthChange(data.user)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        if (data.user) {
          onAuthChange(data.user)
        }
      }
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

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ 
           background: 'var(--bg-primary)',
           minHeight: '100vh',
           position: 'relative'
         }}>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `linear-gradient(135deg, 
                rgba(255, 107, 53, ${0.02 + Math.random() * 0.03}), 
                rgba(0, 212, 255, ${0.02 + Math.random() * 0.03}))`,
              filter: 'blur(80px)',
              width: `${200 + Math.random() * 300}px`,
              height: `${200 + Math.random() * 300}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main auth container */}
      <motion.div 
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative"
             style={{
               background: 'rgba(26, 26, 26, 0.8)',
               backdropFilter: 'blur(40px)',
               WebkitBackdropFilter: 'blur(40px)',
               border: '1px solid rgba(255, 255, 255, 0.1)',
               borderRadius: 'var(--border-radius-xl)',
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
             }}>
          
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-3xl"
               style={{
                 background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(0, 212, 255, 0.05) 50%, rgba(255, 107, 53, 0.1) 100%)',
                 borderRadius: 'var(--border-radius-xl)',
               }} />
          
          <div className="relative p-8">
            {/* Logo/Title */}
            <motion.div 
              className="text-center mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                     boxShadow: '0 20px 40px rgba(255, 107, 53, 0.3)',
                   }}>
                {/* Inner glow */}
                <div className="absolute inset-2 rounded-2xl"
                     style={{
                       background: 'rgba(255, 255, 255, 0.1)',
                       backdropFilter: 'blur(10px)',
                     }} />
                <span className="text-4xl relative z-10">💪</span>
              </div>
              <h2 className="text-4xl font-bold mb-3"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                {isSignUp ? 'Создать аккаунт' : 'FitFlow'}
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                {isSignUp ? 'Начни свою фитнес-путешествие' : 'Вернись к тренировкам'}
              </p>
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.9 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.9 }}
                  className="mb-6 p-4 rounded-2xl relative overflow-hidden"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 'var(--border-radius-lg)',
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl"
                       style={{
                         background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%)',
                       }} />
                  <p className="relative z-10 text-center" style={{ color: '#fca5a5' }}>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Auth form */}
            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full px-5 py-4 rounded-2xl border-none focus:outline-none focus:ring-2 transition-all duration-300 placeholder-transparent peer"
                      style={{
                        background: 'rgba(42, 42, 42, 0.6)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-primary)',
                        fontSize: '16px',
                        borderRadius: 'var(--border-radius-lg)',
                      }}
                      placeholder="Email адрес"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label 
                      htmlFor="email"
                      className="absolute left-5 top-4 transition-all duration-300 pointer-events-none"
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '16px',
                        transform: email || document.activeElement?.id === 'email' 
                          ? 'translateY(-25px) scale(0.85)' 
                          : 'translateY(0) scale(1)',
                        opacity: email || document.activeElement?.id === 'email' ? 0.7 : 1,
                      }}
                    >
                      Email адрес
                    </label>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      required
                      className="w-full px-5 py-4 rounded-2xl border-none focus:outline-none focus:ring-2 transition-all duration-300 placeholder-transparent peer"
                      style={{
                        background: 'rgba(42, 42, 42, 0.6)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-primary)',
                        fontSize: '16px',
                        borderRadius: 'var(--border-radius-lg)',
                      }}
                      placeholder="Пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label 
                      htmlFor="password"
                      className="absolute left-5 top-4 transition-all duration-300 pointer-events-none"
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '16px',
                        transform: password || document.activeElement?.id === 'password' 
                          ? 'translateY(-25px) scale(0.85)' 
                          : 'translateY(0) scale(1)',
                        opacity: password || document.activeElement?.id === 'password' ? 0.7 : 1,
                      }}
                    >
                      Пароль
                    </label>
                  </div>
                </motion.div>
              </div>

              {/* Submit button with liquid morphing */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-semibold text-white relative overflow-hidden group"
                  style={{
                    background: loading 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                    borderRadius: 'var(--border-radius-lg)',
                    minHeight: '56px',
                    boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)',
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 15px 40px rgba(255, 107, 53, 0.4)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {/* Button inner glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       style={{
                         background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                         borderRadius: 'var(--border-radius-lg)',
                       }} />
                  
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={loading ? 'loading' : isSignUp ? 'signup' : 'signin'}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-10"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <motion.div
                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      ) : (
                        isSignUp ? 'Создать аккаунт' : 'Войти'
                      )}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </form>

            {/* Toggle auth mode */}
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                {isSignUp ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
                <motion.button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-semibold transition-all duration-300 relative"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSignUp ? 'Войдите' : 'Зарегистрируйтесь'}
                </motion.button>
              </p>
            </motion.div>
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
