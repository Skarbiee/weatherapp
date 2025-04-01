"use client"

import { useAppContext } from "@/context/app-context"
import { Moon, Sun, ArrowRightLeft } from "lucide-react"

export default function Header() {
  const { theme, toggleTheme, language, toggleLanguage } = useAppContext()
  const bgClass = theme === "dark" ? "bg-blue-300" : "bg-blue-200";
  const bgLang = theme === "dark" ? "bg-blue-300 hover:bg-slate-800 hover:text-white" : "bg-blue-200 hover:bg-slate-800 hover:text-white";

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-full hover:bg-slate-800 transition-colors duration-300 ${bgClass} text-yellow-200 `}
        aria-label={theme === "dark" ? "Light Mode" : "Dark mode"}
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <button
        onClick={toggleLanguage}
        className={`px-3 py-1 rounded-full text-black  transition-colors duration-300 text-sm font-medium ${bgLang}`}
        aria-label={language === "fr" ? "Switch to English" : "Passer au français"}
      >
        <span className={`flex items-center `}>
          <ArrowRightLeft className="w-4 h-4 mr-1" />
          {language === "fr" ? "EN" : "FR"}
        </span>
      </button>
    </div>
  )
}