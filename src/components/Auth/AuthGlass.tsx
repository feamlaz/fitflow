import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'

interface AuthProps {
  onAuthChange: (user: User | null) => void
}

export const AuthGlass = ({ onAuthChange }: AuthProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isIPhone, setIsIPhone] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  // Detect iPhone device
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS/.test(navigator.userAgent)
    setIsIPhone(isIOS && isSafari)
    
    // Load saved email
    const savedEmail = localStorage.getItem('fitflow_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Haptic feedback
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
          if (rememberMe) {
            localStorage.setItem('fitflow_email', email)
          }
          onAuthChange(data.user)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        if (data.user) {
          if (rememberMe) {
            localStorage.setItem('fitflow_email', email)
          } else {
            localStorage.removeItem('fitflow_email')
          }
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

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Введите email для восстановления пароля')
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      
      setError(null)
      // Success haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50])
      }
      alert('Инструкции по восстановлению пароля отправлены на email')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEmailFocus = () => {
    // iOS Safari fix: prevent zoom
    if (isIPhone && emailRef.current) {
      emailRef.current.style.fontSize = '16px'
    }
  }

  const handlePasswordFocus = () => {
    // iOS Safari fix: prevent zoom
    if (isIPhone && passwordRef.current) {
      passwordRef.current.style.fontSize = '16px'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ 
           background: '#000000',
           minHeight: '100vh',
           position: 'relative',
           paddingTop: isIPhone ? 'env(safe-area-inset-top, 0px)' : '0px',
           paddingBottom: isIPhone ? 'env(safe-area-inset-bottom, 0px)' : '0px',
         }}>
      
      {/* Animated background elements - optimized for Safari */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(255, 95, 0, 0.2) 0%, transparent 70%)`,
              width: `${400 + Math.random() * 200}px`,
              height: `${400 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [Math.random() * 50 - 25, Math.random() * 50 - 25],
              y: [Math.random() * 50 - 25, Math.random() * 50 - 25],
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 20 + Math.random() * 15,
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
               background: isIPhone 
                 ? 'rgba(10, 10, 10, 0.95)' 
                 : 'rgba(255, 255, 255, 0.08)',
               backdropFilter: isIPhone ? 'none' : 'blur(20px)',
               WebkitBackdropFilter: isIPhone ? 'none' : 'blur(20px)',
               border: '1px solid rgba(255, 95, 0, 0.15)',
               borderRadius: '24px',
               boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
             }}>
          
          {/* Orange glow effect - optimized */}
          <div className="absolute inset-0 rounded-3xl opacity-30"
               style={{
                 background: 'radial-gradient(circle at 50% 0%, rgba(255, 95, 0, 0.1) 0%, transparent 50%)',
                 borderRadius: '24px',
               }} />
          
          <div className="relative p-8">
            {/* Logo/Title */}
            <motion.div 
              className="text-center mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, #FF5F00 0%, #FF8C00 100%)',
                     boxShadow: '0 15px 30px rgba(255, 95, 0, 0.3)',
                   }}>
                <div className="absolute inset-1 rounded-xl"
                     style={{
                       background: 'rgba(255, 255, 255, 0.15)',
                     }} />
                <span className="text-3xl relative z-10">💪</span>
              </div>
              <h2 className="text-3xl font-bold mb-3 text-white">
                {isSignUp ? 'FitFlow Pro' : 'FitFlow'}
              </h2>
              <p className="text-gray-400 text-sm">
                {isSignUp ? 'Начни свою трансформацию' : 'Вернись к результатам'}
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
                    background: 'rgba(255, 95, 0, 0.1)',
                    border: '1px solid rgba(255, 95, 0, 0.2)',
                    borderRadius: '16px',
                  }}
                >
                  <p className="text-orange-200 text-sm text-center font-medium">{error}</p>
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
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full px-5 py-4 rounded-2xl border-none focus:outline-none transition-all duration-300 placeholder-transparent peer"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '16px',
                        borderRadius: '16px',
                        minHeight: '52px',
                      }}
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={handleEmailFocus}
                    />
                    <label 
                      htmlFor="email"
                      className="absolute left-5 top-4 text-gray-400 transition-all duration-300 pointer-events-none"
                      style={{
                        fontSize: '16px',
                        transform: email || document.activeElement?.id === 'email' 
                          ? 'translateY(-25px) scale(0.85)' 
                          : 'translateY(0) scale(1)',
                        opacity: email || document.activeElement?.id === 'email' ? 0.7 : 1,
                      }}
                    >
                      Email
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
                      ref={passwordRef}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      required
                      className="w-full px-5 py-4 rounded-2xl border-none focus:outline-none transition-all duration-300 placeholder-transparent peer pr-12"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '16px',
                        borderRadius: '16px',
                        minHeight: '52px',
                      }}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={handlePasswordFocus}
                    />
                    <label 
                      htmlFor="password"
                      className="absolute left-5 top-4 text-gray-400 transition-all duration-300 pointer-events-none"
                      style={{
                        fontSize: '16px',
                        transform: password || document.activeElement?.id === 'password' 
                          ? 'translateY(-25px) scale(0.85)' 
                          : 'translateY(0) scale(1)',
                        opacity: password || document.activeElement?.id === 'password' ? 0.7 : 1,
                      }}
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors p-2"
                      style={{
                        fontSize: '18px',
                        minHeight: '44px',
                        minWidth: '44px',
                      }}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </motion.div>

                {/* Remember me checkbox - only for login */}
                {!isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center"
                  >
                    <input
                      id="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      style={{
                        minHeight: '44px',
                        minWidth: '44px',
                      }}
                    />
                    <label 
                      htmlFor="remember"
                      className="ml-2 text-gray-400 text-sm cursor-pointer"
                      style={{
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      Запомнить меня
                    </label>
                  </motion.div>
                )}
              </div>

              {/* Submit button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-bold text-white relative overflow-hidden group"
                  style={{
                    background: loading 
                      ? 'rgba(255, 95, 0, 0.3)' 
                      : 'linear-gradient(135deg, #FF5F00 0%, #FF8C00 100%)',
                    borderRadius: '16px',
                    minHeight: '56px',
                    boxShadow: '0 10px 25px rgba(255, 95, 0, 0.25)',
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 15px 35px rgba(255, 95, 0, 0.35)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
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

            {/* Forgot password - only for login */}
            {!isSignUp && (
              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-orange-400 hover:text-orange-300 text-sm transition-colors duration-200"
                  style={{
                    minHeight: '44px',
                    textDecoration: 'underline',
                  }}
                >
                  Забыли пароль?
                </button>
              </motion.div>
            )}

            {/* Toggle auth mode */}
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-gray-400 text-sm">
                {isSignUp ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
                <motion.button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-semibold text-orange-400 hover:text-orange-300 transition-colors duration-200"
                  style={{
                    textShadow: '0 0 10px rgba(255, 95, 0, 0.3)',
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
      </motion.div>
    </div>
  )
}
