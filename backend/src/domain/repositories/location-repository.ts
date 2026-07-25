import type { CreateLocationInput, Location, UpdateLocationInput } from '../entities/location'

export interface LocationRepository {
  findAll(): Promise<Location[]>
  findById(id: string): Promise<Location | null>
  create(input: CreateLocationInput): Promise<Location>
  update(id: string, input: UpdateLocationInput): Promise<Location | null>
  delete(id: string): Promise<boolean>
}
