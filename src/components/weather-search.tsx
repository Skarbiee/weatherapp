"use client" // Cette directive indique que c'est un Client Component (avec interactivité)

import type React from "react"

import { useState } from "react"
import WeatherDisplay from "./weather-display"

// TypeScript: définition du type pour les données météo
// Cela aide à structurer les données et obtenir l'autocomplétion
interface WeatherData {
  city: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
}

export default function WeatherSearch() {
  // États pour stocker la ville saisie et les données météo
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fonction qui sera appelée lors de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Empêche le rechargement de la page

    if (!city.trim()) return // Vérifie que la ville n'est pas vide

    try {
      setLoading(true)
      setError(null)

      // Appel à notre API route avec la ville comme paramètre de requête
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)

      if (!response.ok) {
        throw new Error("Impossible de récupérer les données météo")
      }

      const data = await response.json()
      setWeather(data)
    } catch (err) {
      setError("Erreur lors de la récupération des données météo")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            Entrez une ville
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paris, New York, Tokyo..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? "Chargement..." : "Rechercher"}
        </button>
      </form>

      {/* Affichage des erreurs */}
      {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {/* Affichage des données météo si disponibles */}
      {weather && <WeatherDisplay weather={weather} />}
    </div>
  )
}

