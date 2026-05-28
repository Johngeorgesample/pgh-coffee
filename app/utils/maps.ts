export const getGoogleMapsUrl = (coordinates: { latitude: number; longitude: number }) =>
  `https://www.google.com/maps?q=${coordinates.longitude},${coordinates.latitude}`
