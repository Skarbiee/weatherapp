"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Définition des types pour notre contexte
type Theme = "light" | "dark"
type Language = "fr" | "en"

interface AppContextType {
  theme: Theme
  toggleTheme: () => void
  language: Language
  toggleLanguage: () => void
  translations: Record<string, string>
}

// Traductions
const translationsData = {
  fr: {
    appTitle: "Application Météo",
    enterCity: "Entrez une ville",
    search: "Rechercher",
    loading: "Chargement...",
    humidity: "Humidité",
    wind: "Vent",
    error: "Erreur lors de la récupération des données météo",
    placeholder: "Paris, New York, Tokyo...",
  },
  en: {
    appTitle: "Weather App",
    enterCity: "Enter a city",
    search: "Search",
    loading: "Loading...",
    humidity: "Humidity",
    wind: "Wind",
    error: "Error retrieving weather data",
    placeholder: "Paris, New York, Tokyo...",
  },
}

// Création du contexte avec des valeurs par défaut
const AppContext = createContext<AppContextType>({
  theme: "light",
  toggleTheme: () => {},
  language: "fr",
  toggleLanguage: () => {},
  translations: translationsData.fr,
})

// Hook personnalisé pour utiliser le contexte
export const useAppContext = () => useContext(AppContext)

// Fournisseur du contexte
export function AppProvider({ children }: { children: ReactNode }) {
  // État pour le thème (avec persistance dans localStorage)
  const [theme, setTheme] = useState<Theme>("light")

  // État pour la langue (avec persistance dans localStorage)
  const [language, setLanguage] = useState<Language>("fr")

  // Traductions actuelles basées sur la langue
  const translations = translationsData[language]

  // Effet pour charger les préférences depuis localStorage au chargement
  useEffect(() => {
    // Récupérer le thème depuis localStorage ou utiliser le thème du système
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Utiliser les préférences du système
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }

    // Récupérer la langue depuis localStorage ou utiliser la langue du navigateur
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "fr" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    } else {
      // Utiliser la langue du navigateur
      const browserLang = navigator.language.split("-")[0]
      setLanguage(browserLang === "fr" ? "fr" : "en")
    }
  }, [])

  // Effet pour appliquer le thème au document HTML
  useEffect(() => {
    // Appliquer la classe dark au document HTML pour Tailwind
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Sauvegarder dans localStorage
    localStorage.setItem("theme", theme)
  }, [theme])

  // Effet pour sauvegarder la langue
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  // Fonction pour basculer la langue
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "fr" ? "en" : "fr"))
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, toggleLanguage, translations }}>
      {children}
    </AppContext.Provider>
  )
}

