import { handle } from 'hono/aws-lambda'
import { createApp } from './app'
import { createContainer } from './di/container'
import { MemoryCacheRepository } from './infrastructure/memory/memory-cache-repository'
import { MemoryLocationRepository } from './infrastructure/memory/memory-location-repository'
import { MemoryUserRepository } from './infrastructure/memory/memory-user-repository'

const container = createContainer({
  userRepository: new MemoryUserRepository(),
  locationRepository: new MemoryLocationRepository(),
  cacheRepository: new MemoryCacheRepository(),
})

const app = createApp(() => container)

export const handler = handle(app)
