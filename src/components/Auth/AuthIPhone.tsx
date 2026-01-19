import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'

interface AuthProps {
  onAuthChange: (user: User | null) => void
}

export const AuthIPhone = ({ onAuthChange }: AuthProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isIPhone, setIsIPhone] = useState(false)
  const [userExists, setUserExists] = useState<boolean | null>(null)
  const [isCheckingUser, setIsCheckingUser] = useState(false)
  
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  // Detect iPhone device and load saved data
  useEffect(() => {
    const detectDevice = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      setIsIPhone(isIOS)
      
      // Load saved credentials
      const savedEmail = localStorage.getItem('fitflow_remembered_email')
      const savedRemember = localStorage.getItem('fitflow_remember_me') === 'true'
      
      if (savedEmail && savedRemember) {
        setEmail(savedEmail)
        setRememberMe(true)
      }
    }
    
    detectDevice()
  }, [])

  // Check if user exists when email changes
  useEffect(() => {
    const checkUserExists = async () => {
      if (email && email.includes('@') && !isSignUp) {
        setIsCheckingUser(true)
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('email')
            .eq('email', email)
            .single()
          
          if (error && error.code !== 'PGRST116') {
            // Error checking user
            setUserExists(null)
          } else {
            setUserExists(!!data)
          }
        } catch (err) {
          setUserExists(null)
        } finally {
          setIsCheckingUser(false)
        }
      } else {
        setUserExists(null)
      }
    }

    const timeoutId = setTimeout(checkUserExists, 500)
    return () => clearTimeout(timeoutId)
  }, [email, isSignUp])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Haptic feedback for iPhone
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              created_at: new Date().toISOString()
            }
          }
        })
        
        if (error) throw error
        
        if (data.user) {
          // Save email if remember me is checked
          if (rememberMe) {
            localStorage.setItem('fitflow_remembered_email', email)
            localStorage.setItem('fitflow_remember_me', 'true')
          }
          
          // Success haptic
          if ('vibrate' in navigator) {
            navigator.vibrate([50, 30, 50])
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
          // Handle remember me
          if (rememberMe) {
            localStorage.setItem('fitflow_remembered_email', email)
            localStorage.setItem('fitflow_remember_me', 'true')
          } else {
            localStorage.removeItem('fitflow_remembered_email')
            localStorage.removeItem('fitflow_remember_me')
          }
          
          // Success haptic
          if ('vibrate' in navigator) {
            navigator.vibrate([50, 30, 50])
          }
          
          onAuthChange(data.user)
        }
      }
    } catch (err: any) {
      let errorMessage = err.message
      
      // Improved error messages for Russian users
      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Неверный email или пароль'
      } else if (err.message?.includes('User already registered')) {
        errorMessage = 'Пользователь с таким email уже зарегистрирован'
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Пожалуйста, подтвердите ваш email'
      } else if (err.message?.includes('Password should be')) {
        errorMessage = 'Пароль должен содержать минимум 6 символов'
      }
      
      setError(errorMessage)
      
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      
      setError(null)
      
      // Success haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50])
      }
      
      alert('Инструкции по восстановлению пароля отправлены на ваш email')
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке письма для восстановления')
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

      {/* Main auth container */}
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
               border: '1px solid rgba(255, 95, 0, 0.2)',
               borderRadius: '20px',
               boxShadow: isIPhone 
                 ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                 : '0 20px 40px rgba(0, 0, 0, 0.4)',
             }}>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-2xl opacity-20"
               style={{
                 background: 'radial-gradient(circle at 50% 0%, rgba(255, 95, 0, 0.08) 0%, transparent 50%)',
                 borderRadius: '20px',
               }} />
          
          <div className="relative p-6">
            {/* Logo/Title */}
            <motion.div 
              className="text-center mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, #FF5F00 0%, #FF8C00 100%)',
                     boxShadow: '0 12px 24px rgba(255, 95, 0, 0.25)',
                   }}>
                <div className="absolute inset-0.5 rounded-xl"
                     style={{
                       background: 'rgba(255, 255, 255, 0.1)',
                     }} />
                <span className="text-2xl relative z-10">💪</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">
                {isSignUp ? 'FitFlow Pro' : 'FitFlow'}
              </h2>
              <p className="text-gray-400 text-sm">
                {isSignUp ? 'Начни свою трансформацию' : 'Вернись к результатам'}
              </p>
            </motion.div>

            {/* User existence indicator */}
            {!isSignUp && email && userExists !== null && !isCheckingUser && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-3 rounded-xl text-sm"
                style={{
                  background: userExists 
                    ? 'rgba(52, 199, 89, 0.1)' 
                    : 'rgba(255, 149, 0, 0.1)',
                  border: `1px solid ${userExists ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 149, 0, 0.2)'}`,
                  borderRadius: '12px',
                }}
              >
                <p style={{ color: userExists ? '#34C759' : '#FF9500' }}>
                  {userExists ? '✅ Пользователь найден' : 'ℹ️ Новый пользователь'}
                </p>
              </motion.div>
            )}

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="mb-4 p-3 rounded-xl relative overflow-hidden"
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

            {/* Auth form */}
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="relative">
                    <input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
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
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={handleEmailFocus}
                    />
                    <label 
                      htmlFor="email"
                      className="absolute left-4 top-3 text-gray-400 transition-all duration-300 pointer-events-none"
                      style={{
                        fontSize: '16px',
                        transform: email || document.activeElement?.id === 'email' 
                          ? 'translateY(-22px) scale(0.8)' 
                          : 'translateY(0) scale(1)',
                        opacity: email || document.activeElement?.id === 'email' ? 0.7 : 1,
                      }}
                    >
                      Email
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
                      ref={passwordRef}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      required
                      className="w-full px-4 py-3 rounded-xl border-none focus:outline-none transition-all duration-300 placeholder-transparent peer pr-12"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        fontSize: '16px',
                        borderRadius: '12px',
                        minHeight: '48px',
                        WebkitAppearance: 'none',
                      }}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={handlePasswordFocus}
                    />
                    <label 
                      htmlFor="password"
                      className="absolute left-4 top-3 text-gray-400 transition-all duration-300 pointer-events-none"
                      style={{
                        fontSize: '16px',
                        transform: password || document.activeElement?.id === 'password' 
                          ? 'translateY(-22px) scale(0.8)' 
                          : 'translateY(0) scale(1)',
                        opacity: password || document.activeElement?.id === 'password' ? 0.7 : 1,
                      }}
                    >
                      Пароль
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors p-2"
                      style={{
                        fontSize: '16px',
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500 focus:ring-2"
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
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Submit button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white relative overflow-hidden group"
                  style={{
                    background: loading 
                      ? 'rgba(255, 95, 0, 0.3)' 
                      : 'linear-gradient(135deg, #FF5F00 0%, #FF8C00 100%)',
                    borderRadius: '12px',
                    minHeight: '48px',
                    boxShadow: '0 8px 20px rgba(255, 95, 0, 0.25)',
                    WebkitAppearance: 'none',
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 12px 28px rgba(255, 95, 0, 0.35)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={loading ? 'loading' : isSignUp ? 'signup' : 'signin'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
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
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
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
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-gray-400 text-sm">
                {isSignUp ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
                <motion.button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError(null)
                  }}
                  className="font-semibold text-orange-400 hover:text-orange-300 transition-colors duration-200"
                  style={{
                    textShadow: '0 0 8px rgba(255, 95, 0, 0.3)',
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
