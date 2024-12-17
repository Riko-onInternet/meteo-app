const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast'
const REVERSE_GEOCODING_URL = 'https://api.open-meteo.com/v1/geocoding'

interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}

interface WeatherData {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    precipitation: number
    wind_speed_10m: number
    weathercode: number
    uv_index: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    weathercode: number[]
    precipitation_probability: number[]
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
  }
}

export async function searchLocation(query: string): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'it'
  })

  const response = await fetch(`${GEOCODING_API_URL}?${params}`)
  const data = await response.json()
  return data.results || []
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weathercode,uv_index',
    hourly: 'temperature_2m,weathercode,precipitation_probability',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
    timezone: 'auto'
  })

  const response = await fetch(`${WEATHER_API_URL}?${params}`)
  return response.json()
}

export async function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalizzazione non supportata dal browser'))
    }

    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

export async function getReverseGeocoding(lat: number, lon: number): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    language: 'it'
  })

  const response = await fetch(`${REVERSE_GEOCODING_URL}?${params}`)
  const data = await response.json()
  return data.results || []
} 