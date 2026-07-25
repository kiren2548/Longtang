import z from 'zod'

export const locationSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  buildingCode: z.string().nullable(),
  floor: z.string().nullable(),
  createdAt: z.iso.datetime(),
})

export const createLocationSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  buildingCode: z.string().optional(),
  floor: z.string().optional(),
})

export const updateLocationSchema = createLocationSchema.partial()

export const idParamSchema = z.object({
  id: z.string().min(1),
})

export const locationResponseSchema = z.object({ data: locationSchema })
export const locationListResponseSchema = z.object({ data: z.array(locationSchema) })
