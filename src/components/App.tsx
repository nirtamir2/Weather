import React from "react"
import Weather from "./Weather"
import NearbyWeather from "./NearbyWeather"
import "./App.css"

const DISTANCE = 0.5

interface IAppWeatherResponse {
  coord: {
    lon: number
    lat: number
  }
  weather: [
    {
      id: number
      main: string
      description: string
      icon: string
    }
  ]
  base: string
  main: {
    temp: number
    pressure: number
    humidity: number
    temp_min: number
    temp_max: number
  }
  visibility: number
  wind: {
    speed: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    message: number
    country: string
    sunrise: number
    sunset: number
  }
  id: number
  name: string
  cod: number
}

async function fetchCurrentWeather({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}) {
  try {
    const apiKey = process.env.GATSBY_OPEN_WEATHER_MAP_API_KEY
    const unit = "metric"
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&APPID=${apiKey}`
    )
    if (response.ok) {
      try {
        return response.json()
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.log(
            "App#fetchCurrentWeather() - Could not parse" + response,
            e
          )
        }
      }
    }
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("App#fetchCurrentWeather() - Network error", e)
    }
  }
}

async function getCurrentCoordinates(): Promise<{
  latitude: number
  longitude: number
}> {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function success(position) {
          const { latitude, longitude } = position.coords
          resolve({ latitude, longitude })
        },
        function error(e) {
          reject(e)
        }
      )
    } else {
      reject("Geolocation is not available")
    }
  })
}

function App(): React.ReactNode {
  const [weatherData, setWeatherData] = React.useState<Readonly<
    IAppWeatherResponse
  > | null>(null)
  const [nearbyWeatherData, setNearbyWeather] = React.useState<
    readonly Readonly<IAppWeatherResponse>[]
  >([])

  const isMountedRef = React.useRef(false)
  React.useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  async function initWeather() {
    try {
      const { latitude, longitude } = await getCurrentCoordinates()
      if (!isMountedRef.current) return
      try {
        const [weatherData, ...nearbyWeatherData] = await Promise.all([
          fetchCurrentWeather({ latitude, longitude }),
          fetchCurrentWeather({ latitude: latitude + DISTANCE, longitude }),
          fetchCurrentWeather({ latitude: latitude - DISTANCE, longitude }),
          fetchCurrentWeather({ latitude, longitude: longitude + DISTANCE }),
          fetchCurrentWeather({ latitude, longitude: longitude - DISTANCE }),
        ])
        if (!isMountedRef.current) return
        setWeatherData(weatherData)
        setNearbyWeather(nearbyWeatherData)
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.log("App#initWeather() - Could not fetch", e)
        }
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log("App#initWeather() - Could not get the location", e)
      }
    }
  }

  React.useEffect(() => {
    initWeather()
  }, [])

  function renderCurrentPositionWeather(): React.ReactNode {
    if (weatherData == null) {
      return "Loading"
    }
    const { name: locationName } = weatherData
    const weather = weatherData.weather[0]
    const { description: weatherDescription, icon: iconCode } = weather
    const { temp, temp_min: tempMin, temp_max: tempMax } = weatherData.main
    const locationCountry = weatherData.sys.country
    return (
      <Weather
        weatherDescription={weatherDescription}
        iconCode={iconCode}
        temp={temp}
        tempMin={tempMin}
        tempMax={tempMax}
        locationName={locationName}
        locationCountry={locationCountry}
      />
    )
  }

  function renderNearbyPositionsWeather(): React.ReactNode {
    return nearbyWeatherData.map(data => {
      const { id, name: locationName } = data
      const weather = data.weather[0]
      const { description: weatherDescription, icon: iconCode } = weather
      const { temp, temp_min: tempMin, temp_max: tempMax } = data.main
      const locationCountry = data.sys.country
      return (
        <NearbyWeather
          key={id}
          weatherDescription={weatherDescription}
          iconCode={iconCode}
          temp={temp}
          tempMin={tempMin}
          tempMax={tempMax}
          locationName={locationName}
          locationCountry={locationCountry}
        />
      )
    })
  }

  return (
    <>
      <div className="App__Main">{renderCurrentPositionWeather()}</div>
      <div className="App__NearbyWeather">{renderNearbyPositionsWeather()}</div>
    </>
  )
}

export default App
