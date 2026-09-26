import { Hono } from 'hono'
import { loginController, signupController } from './auth.controller'

const authRouter = new Hono()

authRouter.post('/signup', signupController)

authRouter.post('/login', loginController)

export default authRouter