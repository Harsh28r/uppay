"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { setUser, setLoading } from "@/lib/slices/authSlice"
import { socketService } from "@/lib/socket"
import type { RootState } from "@/lib/store"
import LoginForm from "./LoginForm"
import Dashboard from "./Dashboard"

const AuthWrapper = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || firebaseUser.email!.split("@")[0],
          createdAt: new Date().toISOString(),
        }
        dispatch(setUser(userData))
        socketService.connect(firebaseUser.uid)
      } else {
        dispatch(setUser(null))
        socketService.disconnect()
      }
      dispatch(setLoading(false))
    })

    return () => unsubscribe()
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return <Dashboard />
}

export default AuthWrapper
