import type { CreateLocationInput, Location, UpdateLocationInput } from '../../domain/entities/location'
import type { LocationRepository } from '../../domain/repositories/location-repository'

interface LocationRow {
  id: string
  name: string
  category: string
  description: string | null
  latitude: number
  longitude: number
  building_code: string | null
  floor: string | null
  created_at: string
}

function toLocation(row: LocationRow): Location {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    latitude: row.latitude,
    longitude: row.longitude,
    buildingCode: row.building_code,
    floor: row.floor,
    createdAt: row.created_at,
  }
}

export class D1LocationRepository implements LocationRepository {
  constructor(private readonly db: D1Database) {}

  async findAll(): Promise<Location[]> {
    const { results } = await this.db
      .prepare('SELECT id, name, category, description, latitude, longitude, building_code, floor, created_at FROM locations ORDER BY created_at DESC')
      .all<LocationRow>()
    return results.map(toLocation)
  }

  async findById(id: string): Promise<Location | null> {
    const row = await this.db
      .prepare('SELECT id, name, category, description, latitude, longitude, building_code, floor, created_at FROM locations WHERE id = ?')
      .bind(id)
      .first<LocationRow>()
    return row ? toLocation(row) : null
  }

  async create(input: CreateLocationInput): Promise<Location> {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    await this.db
      .prepare('INSERT INTO locations (id, name, category, description, latitude, longitude, building_code, floor, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, input.name, input.category, input.description ?? null, input.latitude, input.longitude, input.buildingCode ?? null, input.floor ?? null, createdAt)
      .run()
    return {
      id,
      name: input.name,
      category: input.category,
      description: input.description ?? null,
      latitude: input.latitude,
      longitude: input.longitude,
      buildingCode: input.buildingCode ?? null,
      floor: input.floor ?? null,
      createdAt,
    }
  }

  async update(id: string, input: UpdateLocationInput): Promise<Location | null> {
    const existing = await this.findById(id)
    if (!existing) return null

    const name = input.name ?? existing.name
    const category = input.category ?? existing.category
    const description = input.description !== undefined ? (input.description ?? null) : existing.description
    const latitude = input.latitude ?? existing.latitude
    const longitude = input.longitude ?? existing.longitude
    const buildingCode = input.buildingCode !== undefined ? (input.buildingCode ?? null) : existing.buildingCode
    const floor = input.floor !== undefined ? (input.floor ?? null) : existing.floor

    await this.db
      .prepare('UPDATE locations SET name = ?, category = ?, description = ?, latitude = ?, longitude = ?, building_code = ?, floor = ? WHERE id = ?')
      .bind(name, category, description, latitude, longitude, buildingCode, floor, id)
      .run()

    return { ...existing, name, category, description, latitude, longitude, buildingCode, floor }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM locations WHERE id = ?').bind(id).run()
    return result.meta.changes > 0
  }
}
