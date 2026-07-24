import api from '../api/axios'

export interface VerifyLocationResponse {
  formatted_address: string
  country: string
  state: string
  city: string
  postal_code: string
  latitude: number
  longitude: number
}

export const verifyLocation = async (
  latitude: number,
  longitude: number
): Promise<VerifyLocationResponse> => {
  const response = await api.post('/location/verify-location', {
    latitude,
    longitude,
  })

  return response.data
}
