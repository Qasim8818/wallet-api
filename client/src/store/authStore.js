import { create } from 'zustand'
import { supabase } from '../config/supabase'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null, loading: false })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      return { error }
    }

    toast.success('Account created successfully!')
    return { data }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      return { error }
    }

    toast.success('Signed in successfully!')
    set({ user: data.user })
    return { data }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
      return { error }
    }

    set({ user: null })
    toast.success('Signed out successfully!')
    return {}
  },
}))
