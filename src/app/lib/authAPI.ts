import { useAppStore } from "../stores/useAppStore";

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include' // Important for cookies
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Login failed')
      }
      
      const data = await res.json()
      
      // Update the store with user data
      useAppStore.getState().setCurrentUser(data.user)
      
      // Add success notification
      useAppStore.getState().addNotification({
        message: 'Login successful!',
        type: 'success'
      })
      
      return data
    } catch (error) {
      // Add error notification
      useAppStore.getState().addNotification({
        message: error instanceof Error ? error.message : 'Login failed',
        type: 'error'
      })
      throw error
    }
  },
  
  logout: async () => {
    try {
      // Call logout API if you have one
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear the store
      useAppStore.getState().logout()
      
      // Add notification
      useAppStore.getState().addNotification({
        message: 'Logged out successfully',
        type: 'info'
      })
    }
  },
  
  getCurrentUser: async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
        credentials: 'include'
      })
      
      if (res.ok) {
        const user = await res.json()
        useAppStore.getState().setCurrentUser(user)
        return user
      }
    } catch (error) {
      console.error('Get current user error:', error)
    }
  }
}