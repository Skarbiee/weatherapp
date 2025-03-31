// Ce composant n'a pas besoin d'interactivité, mais comme il reçoit des props
// d'un composant client, il doit aussi être un composant client

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
  
  const getBackgroundColor = (iconCode: string) => {
    // 01 = ciel dégagé
    // 02, 03, 04 = nuages
    // 09, 10 = pluie
    // 11 = orage
    // 13 = neige
    // 50 = brouillard
    if (iconCode.startsWith("01")) {
      return "bg-gradient-to-br from-yellow-300 to-blue-400" // Ensoleillé
    } else if (iconCode.startsWith("02") || iconCode.startsWith("03") || iconCode.startsWith("04")) {
      return "bg-gradient-to-br from-gray-200 to-blue-300" // Nuageux
    } else if (iconCode.startsWith("09") || iconCode.startsWith("10")) {
      return "bg-gradient-to-br from-blue-300 to-gray-400" // Pluie
    } else if (iconCode.startsWith("11")) {
      return "bg-gradient-to-br from-gray-700 to-blue-900 text-white" // Orage
    } else if (iconCode.startsWith("13")) {
      return "bg-gradient-to-br from-blue-50 to-blue-100" // Neige
    } else if (iconCode.startsWith("50")) {
      return "bg-gradient-to-br from-gray-300 to-gray-400" // Brouillard
    }

    return "bg-white" // Couleur par défaut
  }
  
  const backgroundColorClass = getBackgroundColor(weather.icon);

  const isDarkBackground = weather.icon.startsWith("11") // Orage a un fond sombre
  const textColorClass = isDarkBackground ? "text-white" : "text-gray-700"
  
  
  return (
    <div className={`p-6 rounded-lg shadow-md transition-colors duration-500 ${backgroundColorClass}`}>
      <div className="flex items-center justify-between">
        <h2 className={`${textColorClass} text-2xl font-bold`}>{weather.city}</h2>
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
            <p className={isDarkBackground ? "text-gray-300" : "text-gray-500"}>Humidité</p>
            <p className={`font-medium ${textColorClass}`}>{weather.humidity}%</p>
          </div>
          <div>
            <p className={isDarkBackground ? "text-gray-300" : "text-gray-500"}>Vent</p>
            <p className={` ${textColorClass}`}>{weather.windSpeed} km/h</p>
          </div>
        </div>
      </div>
    </div>
  )
}

