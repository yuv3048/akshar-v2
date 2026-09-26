import type { Context } from 'hono'
import { login, signup } from './auth.service'
import { loginSchema, signupSchema } from '@akshar/validation'

export const signupController = async (c: Context) => {

  const body = await c.req.json();

  const result = signupSchema.safeParse(body);

  if(!result.success){
    return c.json(
      {
        message: 'Invalid signup data',
        errors: result.error.issues,
      },
      400
    )
  }

  const signnupResult = await signup(c.env, result.data);

  return c.json(signnupResult);
}


export const loginController = async (c: Context) =>{

  const body = await c.req.json();

  const result = loginSchema.safeParse(body);

  if(!result.success){
    return c.json({
      message: "Invalid login data",
      errors: result.error.issues,
    },
    400,
  )
  }

  const loginResult = await login(result.data);

  return c.json(loginResult);
}