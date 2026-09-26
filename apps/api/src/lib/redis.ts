import { Redis } from '@upstash/redis/cloudflare'
import type { Bindings } from '../types'

export const createRedis = (env: Bindings) => {
  return Redis.fromEnv(env)
}