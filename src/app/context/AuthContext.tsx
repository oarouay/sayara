"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: "USER" | "ADMIN"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        console.log('Auth fetch response status:', res.status);
        console.log('Auth fetch response headers:', Object.fromEntries(res.headers.entries()));

        const responseText = await res.text();
        console.log('Auth fetch response text:', responseText);

        const contentType = res.headers.get('content-type');

        let fetchedUser: User | null = null
        if (res.ok && contentType && contentType.includes('application/json')) {
          try {
            const data = JSON.parse(responseText);
            fetchedUser = data.user || null;
            setUser(fetchedUser);
          } catch (e) {
            console.error('Failed to parse JSON:', e);
            fetchedUser = null;
            setUser(null);
          }
        } else {
          if (!res.ok) {
            console.warn(`Auth fetch response not OK: ${res.status}`);
          }
          if (!(contentType && contentType.includes('application/json'))) {
            console.warn(`Unexpected content type: ${contentType}`);
          }
          fetchedUser = null;
          setUser(null);
        }

        // During local development, provide a hardcoded admin user for convenience.
        // This will only apply when no user was returned from the API.
        const isClient = typeof window !== 'undefined'
        const isDev = isClient && process.env.NODE_ENV === 'development'
        if (isDev && !fetchedUser) {
          const devUser: User = {
            id: 'dev-admin',
            name: 'Dev Admin',
            email: 'test@gmail.com',
            role: 'ADMIN',
          }
          setUser(devUser)
        }
      } catch (error) {
        console.error('Auth fetch failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
