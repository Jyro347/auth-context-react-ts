import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface User {
  id: string
  name: string
}

interface AuthContextValue {
  user: User | null
  login: (name: string) => void
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const storageKey = 'studio-demo-user'

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return

      const value = JSON.parse(saved) as Partial<User> | null
      if (value && typeof value.id === 'string' && typeof value.name === 'string' && value.name.trim()) {
        setUser({ id: value.id, name: value.name })
      }
    } catch {
      // Если хранилище недоступно, приложение открывается в гостевом режиме.
    }
  }, [])

  function login(name: string) {
    const trimmedName = name.trim()
    if (!trimmedName) return

    const nextUser = { id: crypto.randomUUID(), name: trimmedName }
    setUser(nextUser)
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextUser))
    } catch {
      // Вход продолжает работать до перезагрузки.
    }
  }

  function logout() {
    setUser(null)
    try {
      localStorage.removeItem(storageKey)
    } catch {
      // Состояние в текущей вкладке уже сброшено.
    }
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth должен вызываться внутри AuthProvider')
  }

  return context
}

