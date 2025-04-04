"use client"

import type React from "react"
import { useState, useEffect } from "react"
import CurrentDisplay from "./current-display"
import ForecastDisplay from "./forecast-display"
import { useAppContext } from "@/context/app-context"

// Types pour les données météo
interface CurrentData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface ForecastItem{
  date: string;
  temperature: number;
  minTemp: number;
  maxTemp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface ForecastData {
  city: string;
  forecasts: ForecastItem[];
}

export default function WeatherSearch() {
  const { theme, translations, language } = useAppContext()
  const bgClass = theme === "dark" ? "bg-dark" : "bg-white";
  const textClass = theme === "dark" ? "text-white" : "text-black";

  // Stocker la ville saisie et les données météo
  const [city, setCity] = useState("")
  const [lastSearchedCity, setLastSearchedCity] = useState("")
  const [weather, setWeather] = useState<CurrentData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forecastError, setForecastError] = useState<string | null>(null)

  // Récupérer les données météo
  const fetchCurrentData = async (cityName: string) => {
    if (!cityName.trim()) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}&lang=${language}`)

      if (!response.ok) {
        throw new Error(translations.error)
      }

      const data = await response.json()
      setWeather(data)
      setLastSearchedCity(cityName)
    } catch (err) {
      setError(translations.error)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchForecastData = async (cityName: string) => {
    if (!cityName.trim()) return
    try {
      setForecastLoading(true);
      setForecastError(null);
      const response = await fetch(`/api/forecast?city=${encodeURIComponent(cityName)}&lang=${language}`)
      if (!response.ok){
        throw new Error(translations.forecastError ||"Erreur lors de la récupération des prévisions")
      }
      const data = await response.json();
      setForecast(data);
    } catch (err) {
      setForecastError(translations.forecastError || "Erreur lors de la récupération des prévisions")
      console.error("Erreur forecast:", err)
    } finally {
      setForecastLoading(false);
    }
  }

  // Appelée lors de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetchCurrentData(city);
    await fetchForecastData(city);
  }

  // Actualiser les données quand la langue change
  useEffect(() => {
    if (lastSearchedCity) {
      fetchCurrentData(lastSearchedCity)
      fetchForecastData(lastSearchedCity)
    }
  }, [language]) // trigger quand la langue change

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold text-center mb-8 transition-colors duration-300 ${textClass}`}>{translations.appTitle}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="city" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${textClass}`}>
            {translations.enterCity}
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-700 transition-colors duration-300 ${textClass} ${bgClass}`}
            placeholder={translations.placeholder}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 bg-blue-600 hover:bg-blue-700"
        >
          {loading ? translations.loading : translations.search}
        </button>
      </form>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-md bg-red-900 text-red-200">{error}</div>}
      
      {weather && <CurrentDisplay weather={weather} />}
      {forecastError && (
        <div className="p-4 mt-4 bg-red-100 text-red-700 rounded-md bg-red-900 text-red-200">
          {forecastError}
        </div>
      )}

      {forecast && <ForecastDisplay forecastData={forecast} />} 
    </div>
  )
}