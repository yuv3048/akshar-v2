import { createRedis } from "../../lib/redis";
import type { Bindings } from "../../types";
import type { SignupInput } from "@akshar/validation";

const PENDING_SIGNUP_TTL = 60 * 60;

type PendingSignup = Omit<SignupInput, "password"> & {
    passwordHash: string;
}

const getPendingSignupKey = (email: string)=>{
    return `pending_signup:${email}`;
}

export const createPendingSignup = async(env:Bindings, data:PendingSignup)=>{

    const redis = createRedis(env);

    await redis.set(
        getPendingSignupKey(data.email),
        JSON.stringify(data),
        {
            ex: PENDING_SIGNUP_TTL,
        }
    )
};

export const getPendingSignup = async(env:Bindings, email:string): Promise<PendingSignup | null>=>{

    const redis = createRedis(env);

    const data = await redis.get<string>(
        getPendingSignupKey(email),
    )

    if(!data){
        return null;
    }

    return JSON.parse(data) as PendingSignup;
};

export const deletePendingSignup = async(env: Bindings,email: string)=>{

    const redis = createRedis(env);

    await redis.del(getPendingSignupKey(email));
};

