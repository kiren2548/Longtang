import type { CreateLocationInput, Location, UpdateLocationInput } from '../../domain/entities/location'
import type { LocationRepository } from '../../domain/repositories/location-repository'

export class MemoryLocationRepository implements LocationRepository {
  private readonly locations = new Map<string, Location>()

  async findAll(): Promise<Location[]> {
    return [...this.locations.values()]
  }

  async findById(id: string): Promise<Location | null> {
    return this.locations.get(id) ?? null
  }

  async create(input: CreateLocationInput): Promise<Location> {
    const location: Location = {
      id: crypto.randomUUID(),
      name: input.name,
      category: input.category,
      description: input.description ?? null,
      latitude: input.latitude,
      longitude: input.longitude,
      buildingCode: input.buildingCode ?? null,
      floor: input.floor ?? null,
      createdAt: new Date().toISOString(),
    }
    this.locations.set(location.id, location)
    return location
  }

  async update(id: string, input: UpdateLocationInput): Promise<Location | null> {
    const existing = this.locations.get(id)
    if (!existing) return null
    const updated: Location = {
      ...existing,
      name: input.name ?? existing.name,
      category: input.category ?? existing.category,
      description: input.description !== undefined ? (input.description ?? null) : existing.description,
      latitude: input.latitude ?? existing.latitude,
      longitude: input.longitude ?? existing.longitude,
      buildingCode: input.buildingCode !== undefined ? (input.buildingCode ?? null) : existing.buildingCode,
      floor: input.floor !== undefined ? (input.floor ?? null) : existing.floor,
    }
    this.locations.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.locations.delete(id)
  }
}
