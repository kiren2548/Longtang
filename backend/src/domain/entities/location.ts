export interface Location {
  id: string
  name: string
  category: string
  description: string | null
  latitude: number
  longitude: number
  buildingCode: string | null
  floor: string | null
  createdAt: string
}

export interface CreateLocationInput {
  name: string
  category: string
  description?: string
  latitude: number
  longitude: number
  buildingCode?: string
  floor?: string
}

export interface UpdateLocationInput {
  name?: string
  category?: string
  description?: string
  latitude?: number
  longitude?: number
  buildingCode?: string
  floor?: string
}
