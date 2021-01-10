import React, { useContext, useState, useEffect } from "react"
import { auth } from "./config"

type ContextProps = {
  currentUser: firebase.User | null;
  login: any;
  signup: any;
  logout: any;
  resetPassword: any;
  updateEmail: any;
  updatePassword: any
};

 export const AuthContext = React.createContext<Partial<ContextProps>>({})

export function useAuth() {
  return useContext(AuthContext)
}

interface AuthProviderProps {
  children: any
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)
  const [loading, setLoading] = useState(true)

  function signup(email: string, password: string) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function login(email:string, password: string) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email: string) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email: string) {
    return currentUser?.updateEmail(email)
  }

  function updatePassword(password: string) {
    return currentUser?.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
