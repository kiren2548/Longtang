import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { createLocationRouter } from './location-router'
import { createUserRouter } from './user-router'

export function createApiRouter() {
  const api = new Hono<AppEnv>()

  api.route('/users', createUserRouter())
  api.route('/locations', createLocationRouter())

  return api
}
