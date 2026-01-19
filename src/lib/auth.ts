import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  created_at: string
}

export interface AuthResponse {
  user: AuthUser | null
  session: any | null
  error: string | null
}

export class AuthService {
  // Sign up new user
  static async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return {
          user: null,
          session: null,
          error: error.message
        }
      }

      return {
        user: data.user as AuthUser,
        session: data.session,
        error: null
      }
    } catch (err: any) {
      return {
        user: null,
        session: null,
        error: err.message || 'Registration failed'
      }
    }
  }

  // Sign in existing user
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return {
          user: null,
          session: null,
          error: error.message
        }
      }

      return {
        user: data.user as AuthUser,
        session: data.session,
        error: null
      }
    } catch (err: any) {
      return {
        user: null,
        session: null,
        error: err.message || 'Login failed'
      }
    }
  }

  // Sign out
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      localStorage.removeItem('fitflow_email')
      return {
        error: error?.message || null
      }
    } catch (err: any) {
      return {
        error: err.message || 'Sign out failed'
      }
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user as AuthUser
    } catch (err) {
      return null
    }
  }

  // Listen to auth changes
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user as AuthUser || null)
    })
  }

  // Reset password
  static async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      return {
        error: error?.message || null
      }
    } catch (err: any) {
      return {
        error: err.message || 'Password reset failed'
      }
    }
  }

  // Refresh session
  static async refreshSession(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.refreshSession()
      return {
        error: error?.message || null
      }
    } catch (err: any) {
      return {
        error: err.message || 'Session refresh failed'
      }
    }
  }

  // Check if email exists
  static async checkEmailExists(email: string): Promise<{ exists: boolean, error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', email) // В Supabase id пользователя это его email
        .single()

      if (error && error.code !== 'PGRST116') {
        return {
          exists: false,
          error: error.message
        }
      }

      return {
        exists: !!data,
        error: null
      }
    } catch (err: any) {
      return {
        exists: false,
        error: err.message || 'Email check failed'
      }
    }
  }
}
