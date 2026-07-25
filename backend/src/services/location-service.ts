import type { CreateLocationInput, UpdateLocationInput, Location } from '../domain/entities/location'
import { NotFoundError, ValidationError } from '../domain/errors'
import type { CacheRepository } from '../domain/repositories/cache-repository'
import type { LocationRepository } from '../domain/repositories/location-repository'

const CACHE_TTL_SECONDS = 300
const cacheKey = (id: string) => `location:${id}`

export class LocationService {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly cache: CacheRepository
  ) {}

  async listLocations(): Promise<Location[]> {
    return this.locationRepository.findAll()
  }

  async getLocation(id: string): Promise<Location> {
    const cached = await this.cache.get<Location>(cacheKey(id))
    if (cached) return cached

    const location = await this.locationRepository.findById(id)
    if (!location) throw new NotFoundError('Location')

    await this.cache.set(cacheKey(id), location, CACHE_TTL_SECONDS)
    return location
  }

  async createLocation(input: CreateLocationInput): Promise<Location> {
    if (!input.name?.trim()) throw new ValidationError('name is required')
    if (!input.category?.trim()) throw new ValidationError('category is required')
    if (typeof input.latitude !== 'number' || input.latitude < -90 || input.latitude > 90) {
      throw new ValidationError('latitude must be between -90 and 90')
    }
    if (typeof input.longitude !== 'number' || input.longitude < -180 || input.longitude > 180) {
      throw new ValidationError('longitude must be between -180 and 180')
    }

    return this.locationRepository.create({
      name: input.name.trim(),
      category: input.category.trim(),
      description: input.description?.trim(),
      latitude: input.latitude,
      longitude: input.longitude,
      buildingCode: input.buildingCode?.trim(),
      floor: input.floor?.trim(),
    })
  }

  async updateLocation(id: string, input: UpdateLocationInput): Promise<Location> {
    if (input.latitude !== undefined && (input.latitude < -90 || input.latitude > 90)) {
      throw new ValidationError('latitude must be between -90 and 90')
    }
    if (input.longitude !== undefined && (input.longitude < -180 || input.longitude > 180)) {
      throw new ValidationError('longitude must be between -180 and 180')
    }

    const updated = await this.locationRepository.update(id, input)
    if (!updated) throw new NotFoundError('Location')

    await this.cache.delete(cacheKey(id))
    return updated
  }

  async deleteLocation(id: string): Promise<void> {
    const deleted = await this.locationRepository.delete(id)
    if (!deleted) throw new NotFoundError('Location')
    await this.cache.delete(cacheKey(id))
  }
}
