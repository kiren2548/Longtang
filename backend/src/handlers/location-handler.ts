import type { Context } from 'hono'
import type { CreateLocationInput, UpdateLocationInput } from '../domain/entities/location'
import { ValidationError } from '../domain/errors'
import type { LocationService } from '../services/location-service'

export class LocationHandler {
  constructor(private readonly locationService: LocationService) {}

  list = async (c: Context) => {
    const locations = await this.locationService.listLocations()
    return c.json({ data: locations })
  }

  get = async (c: Context) => {
    const location = await this.locationService.getLocation(this.param(c, 'id'))
    return c.json({ data: location })
  }

  create = async (c: Context) => {
    const body = await this.parseJson<CreateLocationInput>(c)
    const location = await this.locationService.createLocation(body)
    return c.json({ data: location }, 201)
  }

  update = async (c: Context) => {
    const body = await this.parseJson<UpdateLocationInput>(c)
    const location = await this.locationService.updateLocation(this.param(c, 'id'), body)
    return c.json({ data: location })
  }

  delete = async (c: Context) => {
    await this.locationService.deleteLocation(this.param(c, 'id'))
    return c.body(null, 204)
  }

  private param(c: Context, name: string): string {
    const value = c.req.param(name)
    if (!value) throw new ValidationError(`${name} param is required`)
    return value
  }

  private async parseJson<T>(c: Context): Promise<T> {
    try {
      return await c.req.json<T>()
    } catch {
      throw new ValidationError('Invalid JSON body')
    }
  }
}
