import { LoginInput, SignupInput } from "@akshar/validation"
import { db } from "@akshar/db"
import { hashPassword, verifyPassword } from "./password";
import { Bindings } from "../../types";
import { generateOtp } from "../../lib/otp";
import { getEmailVerificationState, storeEmailVerificationOtp } from "./otp.service";
import { createPendingSignup, getPendingSignup } from "./pending-signup.service";
import { sendWelcomeEmail } from "./email.service";

export const signup = async (env:Bindings, data: SignupInput) => {
  
  //1.checks existing user
  const existingUser = await db.orm.public.User
        .where({email: data.email})
        .first();

  if(existingUser){
     return{
      success: false,
      reason: "EMAIL_ALREADY_REGISTERED"
     }
  }
  
  //2.check if an unfinished signup already exists
  const pendingSignup = await getPendingSignup(
      env,
      data.email,
  )

  //3.recover pending signup
  if(pendingSignup){
    const passwordMatches = await verifyPassword(
      data.password,
      pendingSignup.passwordHash,
    )

    if(!passwordMatches){
      return{
        success: false,
        reason: "INVALID_SIGNUP_CREDENTIALS",
      };
    }

    const verificationState = await getEmailVerificationState(env, data.email)

    return{
      success:true,
      status: "SIGNUP_RECOVERED",
      verificationState,
    }
  }

  //4. New - check email -  send welcome email.


  //5. Hash password
  const passwordHash = await hashPassword(data.password);

  //6.Create temporary signup state
  await createPendingSignup(env, {
    fname: data.fname,
    lname: data.lname,
    email: data.email,
    passwordHash,
  })

  //7. Generate OTP
  const otp = generateOtp();

  //8. Store OTP
  await storeEmailVerificationOtp(
    env,
    data.email,
    otp,
  );

  //9. send otp email
 
  return {
    message: 'Signup verification started!!',
  }
}

export const login = async (data: LoginInput) =>{

  const user = await db.orm.public.User
    .where({email: data.email})
    .first();

  if(!user || !user.passwordHash){
    throw new Error("Invalid email or password");
  }

  const passwordValid = await verifyPassword(
    data.password,
    user.passwordHash,
  )

  if(!passwordValid){
    throw new Error("Invalid email or password");
  }

  return{
    message: "Login succesful",
    userId:user.id,
  };
};