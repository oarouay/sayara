"use client"

import { useState, useEffect } from "react"
import type { CarMaker } from '@prisma/client'
import Header from "../components/Header"
import PromoBanner from "../components/HeroBanner"
import SearchForm from "../components/SearchForm"
import BrandScroller from "../components/BrandScroller"
import AuthWizard from "../components/AuthWizard"
import WhyChooseUs from "../components/WhyChooseUs"
import Footer from "../components/Footer"
import { useAuth } from "@/app/context/AuthContext"
import type { PublicUser } from "@/types/user"

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null)
  const { setUser } = useAuth()

  // make landing form match listings: fetch makers/types and pass them as props
  const [makers, setMakers] = useState<CarMaker[]>([])
  const [types, setTypes] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/cars')
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        if (Array.isArray(data)) {
          setMakers([])
          setTypes([])
        } else {
          setMakers(data.makers || [])
          setTypes(data.types || [])
        }
      } catch (e) {
        // ignore
      }
    })()

    return () => { cancelled = true }
  }, [])

  const handleAuthSuccess = (userData: PublicUser) => {
    setUser(userData) // 🔥 updates Header automatically
    setShowAuth(null)
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col transition-colors duration-200">
      <Header
        onLogin={() => setShowAuth("login")}
        onRegister={() => setShowAuth("register")}
      />
      <PromoBanner />
      <SearchForm makers={makers} types={types} />
      <BrandScroller />
      <WhyChooseUs />
      <Footer />

      {showAuth && (
        <AuthWizard
          type={showAuth}
          onClose={() => setShowAuth(null)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}
