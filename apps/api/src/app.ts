import { Hono } from 'hono'
import healthRouter from './routes/health'
import authRouter from './features/auth/auth.routes'
import type { Bindings } from './types'
import redisTestRouter from './routes/redis-test'

const app = new Hono<{Bindings: Bindings}>();

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/redis-test', redisTestRouter)
app.route('/health', healthRouter)
app.route('/auth', authRouter);

export default app