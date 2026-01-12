"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  const applyThemeToDOM = (newTheme: Theme) => {
    const html = document.documentElement
    html.classList.toggle("dark", newTheme === "dark")
    html.setAttribute("data-theme", newTheme)
  }

  // Initialize theme from localStorage or system preference on client
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme)
      applyThemeToDOM(savedTheme)
      return
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const systemTheme: Theme = mq.matches ? "dark" : "light"
    setTheme(systemTheme)
    applyThemeToDOM(systemTheme)

    // If user hasn't chosen a theme, follow system changes
    const handleChange = (e: MediaQueryListEvent) => {
      const currentSaved = localStorage.getItem("theme")
      if (currentSaved !== "light" && currentSaved !== "dark") {
        const newSysTheme: Theme = e.matches ? "dark" : "light"
        setTheme(newSysTheme)
        applyThemeToDOM(newSysTheme)
      }
    }

    // addEventListener fallback for older browsers
    if (mq.addEventListener) mq.addEventListener("change", handleChange)
    else mq.addListener(handleChange)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handleChange)
      else mq.removeListener(handleChange)
    }
  }, [])

  // Apply theme changes to DOM and persist choice when it comes from user action
  useEffect(() => {
    applyThemeToDOM(theme)
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    try {
      localStorage.setItem("theme", newTheme)
    } catch (e) {
      // ignore storage errors
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
