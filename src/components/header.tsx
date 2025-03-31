"use client"

import { useAppContext } from "@/context/app-language"
import { Languages } from "lucide-react"

export default function Header() {
  const {language, toggleLanguage } = useAppContext()

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleLanguage}
        className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
        aria-label={language === "fr" ? "Switch to English" : "Passer au français"}
      >
        <span className="flex items-center">
          <Languages className="w-4 h-4 mr-1" />
          {language === "fr" ? "EN" : "FR"}
        </span>
      </button>
    </div>
  )
}