import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}



interface Notification {
  _id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  read: boolean
  createdAt: Date
}

interface AppState{
    currentUser:User|null,
    setCurrentUser:(user:User|null)=>void
    logout:()=>void

    notifications:Notification[],
    addNotification:(notification:Omit<Notification,'_id'|'read'|'createdAt'>)=>void,
    markNotificationAsRead:(id:string)=>void,
    clearNotifications:()=>void

}


export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      
      // Notifications state
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            _id: Math.random().toString(36).substr(2, 9),
            read: false,
            createdAt: new Date(),
            ...notification
          },
          ...state.notifications
        ]
      })),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(notif => 
          notif._id === id ? { ...notif, read: true } : notif
        )
      })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'app-storage', // name for the storage
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        notifications: state.notifications 
      }), // only persist these fields
    }
  )
)