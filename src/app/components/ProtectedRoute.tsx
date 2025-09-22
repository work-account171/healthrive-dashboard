"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '../stores/useAppStore'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppStore()
  const router = useRouter()
  
  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [currentUser, router])
  
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Redirecting to login...</p>
      </div>
    )
  }
  
  return <>{children}</>
}