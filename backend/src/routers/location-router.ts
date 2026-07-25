import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import {
  createLocationSchema,
  idParamSchema,
  locationListResponseSchema,
  locationResponseSchema,
  updateLocationSchema,
} from '../schemas/location-schemas'
import { errorResponseSchema } from '../schemas/user-schemas'
import type { AppEnv } from '../types'

const jsonContent = (schema: Parameters<typeof resolver>[0]) => ({
  'application/json': { schema: resolver(schema) },
})

export function createLocationRouter() {
  const router = new Hono<AppEnv>()

  router.get(
    '/',
    describeRoute({
      tags: ['Locations'],
      summary: 'List all locations',
      responses: {
        200: { description: 'All locations', content: jsonContent(locationListResponseSchema) },
      },
    }),
    (c) => c.get('container').locationHandler.list(c)
  )

  router.post(
    '/',
    describeRoute({
      tags: ['Locations'],
      summary: 'Create a location',
      responses: {
        201: { description: 'Location created', content: jsonContent(locationResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('json', createLocationSchema),
    (c) => c.get('container').locationHandler.create(c)
  )

  router.get(
    '/:id',
    describeRoute({
      tags: ['Locations'],
      summary: 'Get a location by id',
      description: 'Cached in KV for 5 minutes.',
      responses: {
        200: { description: 'Location found', content: jsonContent(locationResponseSchema) },
        404: { description: 'Location not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', idParamSchema),
    (c) => c.get('container').locationHandler.get(c)
  )

  router.patch(
    '/:id',
    describeRoute({
      tags: ['Locations'],
      summary: 'Update a location',
      responses: {
        200: { description: 'Location updated', content: jsonContent(locationResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
        404: { description: 'Location not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', idParamSchema),
    validator('json', updateLocationSchema),
    (c) => c.get('container').locationHandler.update(c)
  )

  router.delete(
    '/:id',
    describeRoute({
      tags: ['Locations'],
      summary: 'Delete a location',
      responses: {
        204: { description: 'Location deleted' },
        404: { description: 'Location not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', idParamSchema),
    (c) => c.get('container').locationHandler.delete(c)
  )

  return router
}
