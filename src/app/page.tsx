"use client"

import { useState } from "react"
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

  const handleAuthSuccess = (userData: PublicUser) => {
    setUser(userData) // 🔥 updates Header automatically
    setShowAuth(null)
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header
        onLogin={() => setShowAuth("login")}
        onRegister={() => setShowAuth("register")}
      />
      <PromoBanner />
      <SearchForm />
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
