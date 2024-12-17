export function getWeatherClass(code: number): string {
  switch (code) {
    case 0:
      return 'sunny'
    case 1:
    case 2:
    case 3:
      return 'cloudy'
    case 45:
    case 48:
      return 'foggy'
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return 'rainy'
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return 'snowy'
    default:
      return 'sunny'
  }
} 