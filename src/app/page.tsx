"use client"

import { useState } from "react"
import Header from "../components/Header"
import PromoBanner from "../components/HeroBanner"
import SearchForm from "../components/SearchForm"
import BrandScroller from "../components/BrandScroller"
import AuthWizard from "../components/AuthWizard"
import WhyChooseUs from "../components/WhyChooseUs";
import Footer from "../components/Footer"

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null)

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header onLogin={() => setShowAuth("login")} onRegister={() => setShowAuth("register")} />
      <PromoBanner />
      <SearchForm />
      <BrandScroller />
      <WhyChooseUs />
      <Footer />
      {showAuth && <AuthWizard type={showAuth} onClose={() => setShowAuth(null)} />}
    </div>
  )
}