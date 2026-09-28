import { Hono } from 'hono'
import { loginController, signupController } from '../controller/auth.controller'

const authRouter = new Hono()

authRouter.post('/signup', signupController)

authRouter.post('/login', loginController)

export default authRouter