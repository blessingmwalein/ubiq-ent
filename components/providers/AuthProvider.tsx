'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loadAuthFromCookies } from '@/store/slices/authSlice'
import { loadSelectedProfile } from '@/store/slices/profileSlice'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  
  useEffect(() => {
    // Load auth data from cookies on mount
    dispatch(loadAuthFromCookies())
    
    // Load selected profile from cookies
    if (isAuthenticated) {
      dispatch(loadSelectedProfile())
    }
  }, [dispatch])

  return <>{children}</>
}
