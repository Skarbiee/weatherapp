"use client"

import { useAppContext } from "@/context/app-context"
import { Droplets, Wind } from "lucide-react"

// TypeScript: définition des types
interface ForecastItem {
  date: string
  temperature: number
  minTemp: number
  maxTemp: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
}

interface ForecastData {
  city: string
  forecasts: ForecastItem[]
}

interface ForecastDisplayProps {
  forecastData: ForecastData
}

export default function ForecastDisplay({ forecastData }: ForecastDisplayProps) {
  const { theme, translations, language } = useAppContext();
  const shadowClass = theme === "dark" ? "shadow-gray-600" : "shadow-gray-400"
  const textClass = theme === "dark" ? "text-white" : "text-gray-900"

  // Fonction pour déterminer la couleur de fond en fonction de l'icône météo
  const getBackgroundColor = (iconCode: string) => {
    const isNight = iconCode.endsWith("n")
    const isDarkMode = theme === "dark"

    // Codes d'icône et background-colors (repris de votre WeatherDisplay)
    if (iconCode.startsWith("01")) { // Ciel dégagé
      if (isDarkMode) { // dark mode
        return isNight
          ? "bg-gradient-to-br from-gray-900 to-blue-950" // Nuit claire
          : "bg-gradient-to-br from-blue-600 to-blue-300" // Jour ensoleillé
      } else { // light mode
        return isNight
          ? "bg-gradient-to-br from-gray-800 to-blue-900" // Nuit claire
          : "bg-gradient-to-br from-yellow-300 to-blue-500" // Jour ensoleillé
      }
    } else if (iconCode.startsWith("02") || iconCode.startsWith("03") || iconCode.startsWith("04")) { // Nuages
      if (isDarkMode) {
        return "bg-gradient-to-br from-gray-700 to-gray-600" // dark mode
      } else {
        return "bg-gradient-to-br from-gray-300 to-blue-400" // light mode
      }
    } else if (iconCode.startsWith("09") || iconCode.startsWith("10")) { // Pluie
      if (isDarkMode) {
        return "bg-gradient-to-br from-gray-800 to-blue-300" // dark mode
      } else {
        return "bg-gradient-to-br from-blue-300 to-gray-400" // light mode
      }
    } else if (iconCode.startsWith("11")) { // Orage
      return "bg-gradient-to-br from-gray-900 to-gray-800"
    } else if (iconCode.startsWith("13")) { // Neige
      if (isDarkMode) {
        return "bg-gradient-to-br from-gray-700 to-blue-200" // dark mode
      } else {
        return "bg-gradient-to-br from-gray-600 to-blue-200" // light mode
      }
    } else if (iconCode.startsWith("50")) { // Brouillard
      if (isDarkMode) {
        return "bg-gradient-to-br from-gray-700 to-gray-800" // dark mode
      } else {
        return "bg-gradient-to-br from-gray-400 to-gray-500" // light mode
      }
    }

    return isDarkMode ? "bg-gray-800" : "bg-white"
  }

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Formater la date selon la langue (fr, en, etc.)
    return date.toLocaleDateString(language, { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }

  // Vérifier si une date est aujourd'hui
  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  }

  return (
    <div className="mt-6">
      <h2 className={`text-xl font-bold mb-4 ${textClass}`}>
        {translations.forecast || "Prévisions"} - {forecastData.city}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {forecastData.forecasts.map((day) => {
          const backgroundColorClass = getBackgroundColor(day.icon);
          const isDarkBackground = theme === "dark" || day.icon.startsWith("11") || day.icon.endsWith("n")
          return (
            <div 
              key={day.date}
              className={`p-4 rounded-lg shadow-md ${shadowClass} transition-colors duration-500 ${backgroundColorClass}`}
            >
              <div className="flex flex-col items-center">
                <h3 className={`font-medium text-center `}>
                  {isToday(day.date) ? (translations.today || "Aujourd'hui") : formatDate(day.date)}
                </h3>
                
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  width={64}
                  height={64}
                  className="my-2"
                />
                
                <p className={`text-2xl font-bold`}>
                  {Math.round(day.temperature)}°C
                </p>
                
                <p className={`text-sm`}>
                  {Math.round(day.minTemp)}° / {Math.round(day.maxTemp)}°
                </p>
                
                <p className={`capitalize text-sm mb-2 ${isDarkBackground ? "text-gray-200" : "text-gray-700"}`}>
                  {day.description}
                </p>
                
                <div className={`flex justify-between w-full text-sm mt-2`}>
                  <div className="flex items-center">
                    <Droplets className="w-4 h-4 mr-1" />
                    <span>{day.humidity}%</span>
                  </div>
                  <div className="flex items-center">
                    <Wind className="w-4 h-4 mr-1" />
                    <span>{day.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}