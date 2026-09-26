import { Hono } from 'hono'
import { createRedis } from '../lib/redis'
import type { Bindings } from '../types'

const redisTestRouter = new Hono<{ Bindings: Bindings }>()

redisTestRouter.get('/', async (c) => {
  const redis = createRedis(c.env)

  await redis.set('akshar:test', 'hello')

  const value = await redis.get('akshar:test')

  return c.json({
    message: 'Redis connected',
    value,
  })
})

export default redisTestRouter