import { NextResponse } from "next/server"

// Use environment variable instead of hardcoding the API key
const API_KEY = process.env.OPENWEATHERMAP_API_KEY

export async function GET(request: Request) {
  try {
    // Récupération du paramètre city depuis l'URL
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const lang = searchParams.get("lang")

    if (!city) {
      // Si aucune ville n'est fournie, renvoyer une erreur 400
      return NextResponse.json({ error: "Le paramètre city est requis" }, { status: 400 })
    }

    // Appel à l'API OpenWeatherMap
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=${lang}`,
    )

    if (!response.ok) {
      // Si l'API renvoie une erreur, la transmettre au client
      const error = await response.json()
      return NextResponse.json(
        { error: "Erreur lors de la récupération des données météo" },
        { status: response.status },
      )
    }

    // Traitement des données reçues de l'API
    const data = await response.json()

    // Formatage des données pour notre frontend
    const weatherData = {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
    }

    // Renvoi des données formatées au client
    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Erreur API:", error)
    return NextResponse.json({ error: "Erreur serveur lors de la récupération des données météo" }, { status: 500 })
  }
}

