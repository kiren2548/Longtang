import { createApp } from './app'
import { createContainer } from './di/container'
import { D1LocationRepository } from './infrastructure/d1/d1-location-repository'
import { D1UserRepository } from './infrastructure/d1/d1-user-repository'
import { KVCacheRepository } from './infrastructure/kv/kv-cache-repository'
import type { Bindings } from './types'

const app = createApp((env) => {
  const bindings = env as Bindings
  return createContainer({
    userRepository: new D1UserRepository(bindings.DB),
    locationRepository: new D1LocationRepository(bindings.DB),
    cacheRepository: new KVCacheRepository(bindings.KV),
  })
})

export default app
