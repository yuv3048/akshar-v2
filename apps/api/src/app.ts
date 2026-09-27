import { Hono } from 'hono'
import healthRouter from './routes/health'
import authRouter from './features/auth/auth.routes'
import type { Bindings } from './types'
import redisTestRouter from './routes/redis-test'
import { sendVerificationOtpEmail } from './lib/email/send-email'

const app = new Hono<{Bindings: Bindings}>();

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post("/test-email", async (c) => {
  try {
    const result = await sendVerificationOtpEmail(c.env, {
      email: "yuvi7341@gmail.com",
      otp: "596853",
    });

    return c.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.route('/redis-test', redisTestRouter)
app.route('/health', healthRouter)
app.route('/auth', authRouter);

export default app