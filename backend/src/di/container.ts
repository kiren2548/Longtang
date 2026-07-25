import type { CacheRepository } from '../domain/repositories/cache-repository'
import type { LocationRepository } from '../domain/repositories/location-repository'
import type { UserRepository } from '../domain/repositories/user-repository'
import { LocationHandler } from '../handlers/location-handler'
import { UserHandler } from '../handlers/user-handler'
import { LocationService } from '../services/location-service'
import { UserService } from '../services/user-service'

export interface Repositories {
  userRepository: UserRepository
  locationRepository: LocationRepository
  cacheRepository: CacheRepository
}

export interface Container {
  userHandler: UserHandler
  locationHandler: LocationHandler
}

export function createContainer(repos: Repositories): Container {
  const userService = new UserService(repos.userRepository, repos.cacheRepository)
  const locationService = new LocationService(repos.locationRepository, repos.cacheRepository)
  return {
    userHandler: new UserHandler(userService),
    locationHandler: new LocationHandler(locationService),
  }
}
