import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning } from 'lucide-react'

interface WeatherIconProps {
  code: number
  className?: string
}

export function WeatherIcon({ code, className }: WeatherIconProps) {
  switch (code) {
    case 0:
      return <Sun className={`${className} text-gold`} />
    case 1:
    case 2:
    case 3:
      return <Cloud className={`${className} text-gray-200`} />
    case 45:
    case 48:
      return <CloudFog className={`${className} text-gray-400`} />
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
      return <CloudRain className={`${className} text-blue-500`} />
    case 71:
    case 73:
    case 75:
    case 77:
      return <CloudSnow className={`${className} text-white`} />
    case 95:
    case 96:
    case 99:
      return <CloudLightning className={`${className} text-gold`} />
    default:
      return <Cloud className={`${className} text-white`} />
  }
} 