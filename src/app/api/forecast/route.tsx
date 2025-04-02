import { NextResponse } from "next/server"

const API_KEY = process.env.OPENWEATHERMAP_API_KEY

// Définition des interfaces pour typer les données
interface WeatherForecast {
  dt: number
  main: {
    temp: number
    humidity: number
  }
  weather: {
    icon: string
    description: string
  }[]
  wind: {
    speed: number
  }
}

interface ForecastResponse {
  list: WeatherForecast[]
  city: {
    name: string
  }
}

interface DayData {
  date: string
  temperatures: number[]
  noon: {
    hour: number
    forecast: WeatherForecast | null
  }
  minTemp: number
  maxTemp: number
  humidity: number
  windSpeed: number
  icon: string
  description: string
}

interface DailyForecast {
  date: string
  temperature: number
  minTemp: number
  maxTemp: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
}

export async function GET(request: Request) {
  try {
    // Récupération des paramètres depuis l'URL
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const lang = searchParams.get("lang") || "fr"

    if (!city) {
      return NextResponse.json({ error: "Le paramètre city est requis" }, { status: 400 })
    }

    // Utiliser directement l'API de prévision sur 5 jours avec le nom de la ville
    // Cette API est gratuite et disponible pour tous les utilisateurs
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=${lang}`,
    )

    if (!forecastResponse.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération des prévisions météo" },
        { status: forecastResponse.status },
      )
    }

    const forecastData: ForecastResponse = await forecastResponse.json()

    // Traiter les données pour obtenir les prévisions par jour
    const dailyForecasts = processForecastData(forecastData)

    // Renvoi des données formatées au client
    return NextResponse.json({
      city: forecastData.city.name,
      forecasts: dailyForecasts,
    })
  } catch (error) {
    console.error("Erreur API forecast:", error)
    return NextResponse.json({ error: "Erreur serveur lors de la récupération des prévisions météo" }, { status: 500 })
  }
}

// Fonction pour traiter les données de prévision et les regrouper par jour
function processForecastData(data: ForecastResponse): DailyForecast[] {
  const forecasts = data.list
  const dailyData: Record<string, DayData> = {}

  // Date actuelle pour identifier "aujourd'hui"
  const today = new Date().toISOString().split("T")[0]

  // Regrouper les prévisions par jour
  forecasts.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000)
    const day = date.toISOString().split("T")[0] // Format YYYY-MM-DD
    const hour = date.getHours()

    // Initialiser le jour s'il n'existe pas
    if (!dailyData[day]) {
      dailyData[day] = {
        date: day,
        temperatures: [],
        noon: { hour: 24, forecast: null }, // Pour trouver la prévision de midi
        minTemp: Number.POSITIVE_INFINITY,
        maxTemp: Number.NEGATIVE_INFINITY,
        humidity: 0,
        windSpeed: 0,
        icon: "",
        description: "",
      }
    }

    // Collecter toutes les températures pour calculer moyenne/min/max
    dailyData[day].temperatures.push(forecast.main.temp)

    // Mettre à jour min/max température
    dailyData[day].minTemp = Math.min(dailyData[day].minTemp, forecast.main.temp)
    dailyData[day].maxTemp = Math.max(dailyData[day].maxTemp, forecast.main.temp)

    // Trouver la prévision la plus proche de midi (12h)
    const distanceToNoon = Math.abs(hour - 12)
    if (distanceToNoon < dailyData[day].noon.hour) {
      dailyData[day].noon = {
        hour: distanceToNoon,
        forecast,
      }

      // Utiliser les données de midi pour ces valeurs
      dailyData[day].humidity = forecast.main.humidity
      dailyData[day].windSpeed = forecast.wind.speed
      dailyData[day].icon = forecast.weather[0].icon
      dailyData[day].description = forecast.weather[0].description
    }
  })

  // Formatter les données pour chaque jour
  const dailyForecasts = Object.values(dailyData)
    .sort((a, b) => a.date.localeCompare(b.date)) // Trier par date
    .map((day: DayData) => {
      // Calculer la température moyenne
      const avgTemp = day.temperatures.reduce((sum: number, temp: number) => sum + temp, 0) / day.temperatures.length

      return {
        date: day.date,
        temperature: avgTemp, // Température moyenne
        minTemp: day.minTemp,
        maxTemp: day.maxTemp,
        description: day.description,
        humidity: day.humidity,
        windSpeed: day.windSpeed,
        icon: day.icon,
      }
    })
    .slice(0, 5) // S'assurer qu'on n'a que 5 jours max

  return dailyForecasts
}