export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return "Soleggiato"
    case 1:
    case 2:
    case 3:
      return "Parzialmente nuvoloso"
    case 45:
    case 48:
      return "Nebbia"
    case 51:
    case 53:
    case 55:
      return "Pioggerella"
    case 61:
    case 63:
    case 65:
      return "Pioggia"
    case 71:
    case 73:
    case 75:
      return "Neve"
    case 77:
      return "Neve granulosa"
    case 80:
    case 81:
    case 82:
      return "Rovesci di pioggia"
    case 85:
    case 86:
      return "Rovesci di neve"
    case 95:
      return "Temporale"
    case 96:
    case 99:
      return "Temporale con grandine"
    default:
      return "Condizioni meteo non disponibili"
  }
}