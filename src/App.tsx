/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import { searchLocation, getWeather, getCurrentPosition, getReverseGeocoding } from './utils/api'
import { Search, CloudAlert, Thermometer, Wind, Droplets, Sun } from 'lucide-react'
import { getWeatherDescription } from './utils/weatherCodes'
import { WeatherIcon } from './components/WeatherIcon'
import { getWeatherClass } from './utils/weatherClass'

function App() {
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [weatherData, setWeatherData] = useState<any>(null)
  const [error, setError] = useState('')

  const getWeatherImage = (code: number): string => {
    switch (code) {
      case 0:
        return '/img/sunny.png'
      case 1:
      case 2:
      case 3:
        return '/img/cloudy.png'
      case 45:
      case 48:
        return '/img/foggy.png'
      case 51:
      case 53:
      case 55:
      case 61:
      case 63:
      case 65:
      case 80:
      case 81:
      case 82:
        return '/img/rainy.png'
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        return '/img/snowy.png'
      default:
        return '/img/sunny.png'
    }
  }

  useEffect(() => {
    async function loadLocationWeather() {
      try {
        setIsLoading(true)
        const position = await getCurrentPosition()
        const { latitude, longitude } = position.coords

        const locations = await getReverseGeocoding(latitude, longitude)
        if (locations.length === 0) {
          return
        }

        const weather = await getWeather(latitude, longitude)
        setWeatherData({
          location: locations[0],
          weather
        })
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadLocationWeather()
  }, [])

  useEffect(() => {
    const body = document.body
    const weatherClass = weatherData?.weather?.current?.weathercode 
      ? getWeatherClass(weatherData.weather.current.weathercode)
      : 'sunny'

    // Rimuovi tutte le classi meteo
    body.classList.remove('sunny', 'cloudy', 'foggy', 'rainy', 'snowy')
    
    // Aggiungi la nuova classe
    body.classList.add(weatherClass)

    // Aggiorna il theme-color
    const themeColors = {
      sunny: '#42a5f5',
      cloudy: '#78909c',
      foggy: '#546e7a',
      rainy: '#283593',
      snowy: '#424242'
    }
    
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', themeColors[weatherClass as keyof typeof themeColors])
  }, [weatherData?.weather?.current?.weathercode])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const locations = await searchLocation(search)

      if (locations.length === 0) {
        setError('Nessuna città trovata con questo nome')
        return
      }

      const firstLocation = locations[0]
      if (!firstLocation.name.toLowerCase().includes(search.toLowerCase())) {
        setError('Nessuna città trovata con questo nome')
        return
      }

      const weather = await getWeather(firstLocation.latitude, firstLocation.longitude)

      setWeatherData({
        location: firstLocation,
        weather
      })
    } catch (err) {
      setError('Si è verificato un errore durante il recupero dei dati')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderLoading = () => (
    <div className="bg-black/5 rounded-lg p-2 text-center text-white py-3 flex flex-col items-center justify-center gap-2">
      <div className="animate-spin size-20 border-4 border-white border-t-transparent rounded-full" />
      <span className="text-lg px-6">Caricamento in corso...</span>
    </div>
  )

  const renderError = () => (
    <div className="bg-black/5 rounded-lg p-2 text-center text-white py-4 flex flex-col items-center justify-center gap-2">
      <CloudAlert className="size-20 text-red-500 bg-red-500/20 rounded-full p-4" />
      <span className="text-lg px-6">{error}</span>
    </div>
  )

  const renderWeatherData = () => {
    // Ottieni l'ora corrente
    const currentHour = new Date().getHours()

    // Trova l'indice dell'ora corrente nell'array delle previsioni
    const currentHourIndex = weatherData.weather.hourly.time.findIndex((time: string) =>
      new Date(time).getHours() === currentHour
    )

    // Prendi le prossime 8 ore a partire dall'ora corrente
    const nextHours = weatherData.weather.hourly.time.slice(currentHourIndex, currentHourIndex + 8)

    return (
      <div className="flex flex-col items-start justify-start w-full h-full gap-4">
        <div className="p-6 text-white relative w-full">
          <div className="px-4">
            <div className="flex flex-col items-start justify-between mb-4">
              <p className="text-2xl leading-none">
                {weatherData.location.name}
              </p>
              <p className="text-6xl leading-none font-medium my-4">
                {Math.round(weatherData.weather.current.apparent_temperature)}°
              </p>
              <p className="text-lg">
                {getWeatherDescription(weatherData.weather.current.weathercode)}
              </p>
            </div>
            <div className="flex flex-row items-center justify-between">
              <p className="text-lg">
                <span>
                  {Math.round(weatherData.weather.daily.temperature_2m_max[0])}°
                </span>
                {" "}/{" "}
                <span>
                  {Math.round(weatherData.weather.daily.temperature_2m_min[0])}°
                </span>
                {" "}
                <span>
                  Temperatura percepita {Math.round(weatherData.weather.current.apparent_temperature)}°
                </span>
              </p>
            </div>
          </div>
          <div className="absolute top-[1.5rem] mr-6 right-0 w-2/5 h-max">
            <img src={getWeatherImage(weatherData.weather.current.weathercode)} className="object-cover" />
          </div>
        </div>

        {/* Previsioni orarie */}
        <div className="bg-black/5 rounded-lg  text-white w-full overflow-hidden">
          <div className="flex flex-col pt-6 gap-4">
            <h3 className="text-xl font-medium ml-6">Previsioni orarie</h3>

            <div className="flex flex-row items-center justify-between overflow-x-auto pb-6 scroll-container">
              {nextHours.map((time: string, index: number) => {
                const actualIndex = currentHourIndex + index
                const hour = new Date(time).getHours()
                const temp = Math.round(weatherData.weather.hourly.temperature_2m[actualIndex])
                const code = weatherData.weather.hourly.weathercode[actualIndex]
                const precipitation = weatherData.weather.hourly.precipitation_probability[actualIndex]

                return (
                  <div key={time} className="flex flex-col items-center justify-center gap-2 min-w-[80px]">
                    <span className="text-sm">
                      {index === 0 ? "Ora" : `${hour}:00`}
                    </span>
                    <WeatherIcon code={code} className="w-8 h-8" />
                    <span className="text-lg font-medium">{temp}°</span>
                    <span className="text-xs text-white/70">{precipitation}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Condizioni dell'aria */}
        <div className="bg-black/5 rounded-lg p-6 text-white w-full">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium">Condizioni dell'aria</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Thermometer className="w-8 h-8 text-white/70" />
                <div>
                  <p className="text-sm text-white/70">Temperatura percepita</p>
                  <p className="text-lg">{Math.round(weatherData.weather.current.apparent_temperature)}°</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Wind className="w-8 h-8 text-white/70" />
                <div>
                  <p className="text-sm text-white/70">Vento</p>
                  <p className="text-lg">{Math.round(weatherData.weather.current.wind_speed_10m)} km/h</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Droplets className="w-8 h-8 text-white/70" />
                <div>
                  <p className="text-sm text-white/70">Umidità</p>
                  <p className="text-lg">{weatherData.weather.current.relative_humidity_2m}%</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Sun className="w-8 h-8 text-white/70" />
                <div>
                  <p className="text-sm text-white/70">Indice UV</p>
                  <p className="text-lg">
                    {weatherData.weather.current.uv_index ?? '0'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Previsioni prossimi giorni */}
        <div className="bg-black/5 rounded-lg p-6 text-white w-full mb-10">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium">Previsioni prossimi 7 giorni</h3>

            <div className="flex flex-col gap-4">
              {weatherData.weather.daily.time.map((time: string, index: number) => {
                const date = new Date(time)
                const dayName = date.toLocaleDateString('it-IT', { weekday: 'long' })
                const formattedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1)
                const temp_max = Math.round(weatherData.weather.daily.temperature_2m_max[index])
                const temp_min = Math.round(weatherData.weather.daily.temperature_2m_min[index])
                const precipitation = Math.round(weatherData.weather.daily.precipitation_sum[index])
                const code = weatherData.weather.hourly.weathercode[index * 24]

                return (
                  <div key={time} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <WeatherIcon code={code} className="w-8 h-8" />
                      <span className="text-lg">{index === 0 ? 'Oggi' : formattedDay}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white/70">{precipitation} mm</span>
                      <div className="w-14 text-right">
                        <span className="font-medium">{temp_max}°</span>
                        {" / "}
                        <span className="text-white/70">{temp_min}°</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderInitialMessage = () => (
    <div className="bg-black/5 rounded-lg p-2 text-center text-white py-3 flex flex-col items-center justify-center gap-2">
      <Search className="size-20 text-white bg-white/20 rounded-full p-4" />
      <span className="text-lg px-6">Inserisci il nome di una città per visualizzare le previsioni meteo</span>
    </div>
  )

  return (
    <div className="w-full h-max">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-4 max-w-[600px] w-full mx-auto py-4">
        <img src="https://riko-storage.sirv.com/app_meteo/icon.svg" alt="Icona" className="w-10 h-10 filter drop-shadow-icon dark:drop-shadow-none" />

        <div className="max-w-[400px] bg-black/5 rounded-lg p-2">
          <form onSubmit={handleSearch} className="flex flex-row items-center justify-center gap-2">
            <button type="submit" onClick={handleSearch}>
              <Search className="w-5 h-5 text-white" />
            </button>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca una città"
              className="w-full p-1 rounded-lg bg-transparent text-white placeholder:text-white/50"
            />
          </form>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-row items-center justify-center mx-auto max-w-[600px] w-full h-max">
        <div className="w-full h-full">
          {isLoading ? renderLoading() : error ? renderError() : weatherData ? renderWeatherData() : renderInitialMessage()}
        </div>
      </div>
    </div>
  )
}

export default App
