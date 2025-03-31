"use client"

import { useAppContext } from "@/context/app-context"

// TypeScript: définition du type pour les props du composant
interface WeatherData {
  city: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
}

interface WeatherDisplayProps {
  weather: WeatherData
}

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  const { theme, translations } = useAppContext()

  // Fonction pour déterminer la couleur de fond en fonction de l'icône météo
  const getBackgroundColor = (iconCode: string) => {
    const isNight = iconCode.endsWith("n")
    const isDarkMode = theme === "dark"

    // Adapter les couleurs en fonction du thème et du jour/nuit
    // 01 = ciel dégagé
    // 02, 03, 04 = nuages
    // 09, 10 = pluie
    // 11 = orage
    // 13 = neige
    // 50 = brouillard
    if (iconCode.startsWith("01")) {
      // Ciel dégagé
      if (isDarkMode) {
        // dark mode
        return isNight
          ? "bg-gradient-to-br from-gray-900 to-blue-950" // Nuit claire
          : "bg-gradient-to-br from-blue-600 to-blue-300" // Jour ensoleillé
      } else {
        // light mode
        return isNight
          ? "bg-gradient-to-br from-gray-800 to-blue-900 text-white" // Nuit claire
          : "bg-gradient-to-br from-yellow-300 to-blue-500" // Jour ensoleillé
      }
    } else if (iconCode.startsWith("02") || iconCode.startsWith("03") || iconCode.startsWith("04")) {
      // Nuageux
      if (isDarkMode) {
        return "bg-gradient-to-br from-gray-700 to-gray-600" // dark mode
      } else {
        return "bg-gradient-to-br from-gray-300 to-blue-400" // light mode
      }
    } else if (iconCode.startsWith("09") || iconCode.startsWith("10")) {
      // Pluie
      if (isDarkMode) {
        return "bg-gradient-to-br from-gray-800 to-blue-300"
      } else {
        return "bg-gradient-to-br from-blue-300 to-gray-400"
      }
    } else if (iconCode.startsWith("11")) {
      // Orage
      return "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
    } else if (iconCode.startsWith("13")) {
      // Neige
      if (isDarkMode) {
        return "bg-gradient-to-br from-gray-700 to-blue-200"
      } else {
        return "bg-gradient-to-br from-gray-300 to-blue-200"
      }
    } else if (iconCode.startsWith("50")) {
      // Brouillard
      if (isDarkMode) {
        return "bg-gradient-to-br from-gray-700 to-gray-800" // light mode
      } else {
        return "bg-gradient-to-br from-gray-400 to-gray-500" // dark mode
      }
    }

    return isDarkMode ? "bg-gray-800" : "bg-white"
  }

  // Obtenir la classe de couleur de fond
  const backgroundColorClass = getBackgroundColor(weather.icon)

  // Déterminer si le texte doit être foncé ou clair
  const isDarkBackground = theme === "dark" || weather.icon.startsWith("11") || weather.icon.endsWith("n")
  const textColorClass = isDarkBackground ? "text-white" : "text-gray-800"

  return (
    <div className={`p-6 rounded-lg shadow-md transition-colors duration-500 ${backgroundColorClass}`}>
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${textColorClass}`}>{weather.city}</h2>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          width={80}
          height={80}
        />
      </div>

      <div className="mt-4 space-y-2">
        <p className={`text-4xl font-bold ${textColorClass}`}>{Math.round(weather.temperature)}°C</p>
        <p className={`capitalize ${isDarkBackground ? "text-gray-200" : "text-gray-700"}`}>{weather.description}</p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className={isDarkBackground ? "text-gray-300" : "text-gray-500"}>{translations.humidity}</p>
            <p className={`font-medium ${textColorClass}`}>{weather.humidity}%</p>
          </div>
          <div>
            <p className={isDarkBackground ? "text-gray-300" : "text-gray-500"}>{translations.wind}</p>
            <p className={`font-medium ${textColorClass}`}>{weather.windSpeed} km/h</p>
          </div>
        </div>
      </div>
    </div>
  )
}

