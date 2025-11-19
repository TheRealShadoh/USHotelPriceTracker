// Use relative API paths - works with Vite proxy in dev and any reverse proxy in production
const API_BASE_URL = '/api'

export async function fetchHotels() {
  const response = await fetch(`${API_BASE_URL}/hotels`)
  if (!response.ok) throw new Error(`Failed to fetch hotels: ${response.status}`)
  return response.json()
}

export async function fetchHotel(id: string) {
  const response = await fetch(`${API_BASE_URL}/hotels/${id}`)
  if (!response.ok) throw new Error(`Failed to fetch hotel: ${response.status}`)
  return response.json()
}

export async function refreshCache() {
  const response = await fetch(`${API_BASE_URL}/refresh`, { method: 'POST' })
  if (!response.ok) throw new Error(`Failed to refresh cache: ${response.status}`)
  return response.json()
}
