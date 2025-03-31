"use client"

import type React from "react"

import { useState } from "react"
import WeatherDisplay from "./weather-display"
import { useAppContext } from "@/context/app-context"

// TypeScript: définition du type pour les données météo
interface WeatherData {
  city: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
}

export default function WeatherSearch() {
  const { translations } = useAppContext()

  // États pour stocker la ville saisie et les données météo
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fonction qui sera appelée lors de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!city.trim()) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)

      if (!response.ok) {
        throw new Error(translations.error)
      }

      const data = await response.json()
      setWeather(data)
    } catch (err) {
      setError(translations.error)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">{translations.appTitle}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            {translations.enterCity}
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            placeholder={translations.placeholder}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {loading ? translations.loading : translations.search}
        </button>
      </form>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900 dark:text-red-200">{error}</div>}

      {weather && <WeatherDisplay weather={weather} />}
    </div>
  )
}

