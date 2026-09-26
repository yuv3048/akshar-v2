import { createRedis } from "../../lib/redis"
import { generateOtp, hashOtp } from "../../lib/otp"
import type { Bindings } from "../../types"

const OTP_TTL = 60*7;
const MAX_ATTEMPTS = 5;
const OTP_LOCK_TTL = 60 * 10;


const getOtpKey = (email: string)=>{
    return `email_verification:${email}`;
}

const getOtpLockKey = (email: string) => {
    return `otp_lock:${email}`;
};

export const storeEmailVerificationOtp = async(env:Bindings, email:string, otp:string)=>{

    const redis = createRedis(env);

    const otpHash = await hashOtp(otp);

    const value = JSON.stringify({
        otpHash,
        attempts: MAX_ATTEMPTS,
    });

    await redis.set(getOtpKey(email), value,{
        ex: OTP_TTL,
    });
};


export const verifyEmailVerificationOtp = async(env: Bindings, email: string, otp: string)=>{

    const redis = createRedis(env);

    const lockKey = getOtpLockKey(email);

    const locked = await redis.exists(lockKey);

    if (locked) {
        return {
            success: false,
            reason: "OTP_LOCKED",
        };
    }

    const key = getOtpKey(email);

    const stored = await redis.get<string>(key);

    if(!stored){
        return{
            success: false,
            reason: "OTP_EXPIRED",
        };
    }

    const data = JSON.parse(stored) as {
        otpHash: string;
        attempts: number;
    };


    const submittedHash = await hashOtp(otp);

    if(submittedHash !== data.otpHash){

        data.attempts -= 1;

        if(data.attempts <= 0){

            await redis.del(key);

            await redis.set(lockKey, "OTP_LOCKED",{
                ex:OTP_LOCK_TTL,
            });

            return{
                success: false,
                reason : "TOO_MANY_ATTEMPTS",
            }
        }

        const ttl = await redis.ttl(key);

        if(ttl > 0){
            await redis.set(key, JSON.stringify(data),{
                ex: ttl,
            });
        }

        return {
            success: false,
            reason: "INVALID_OTP",
            attemptsRemaining: data.attempts,
        };
    }

    await redis.del(key);

    return {
        success:true,
    }
}

export const resendEmailVerificationOtp = async(env:Bindings, email:string)=>{

    const redis = createRedis(env);

    const otpLocked = await redis.exists(getOtpLockKey(email));

    if(otpLocked){
        return{
            success: false,
            reason: "OTP_LOCKED",
        };
    }

    const otpExists = await redis.exists(getOtpKey(email));

    if(otpExists){
        return{
            success: false,
            reason: "OTP_STILL_ACTIVE",
        };
    }

    const otp = generateOtp();

    await storeEmailVerificationOtp(env, email, otp);

    return{
        success: true,
        otp,
    }
}

export const getEmailVerificationState = async(env: Bindings, email: string)=>{

    const redis = createRedis(env);

    const lockKey = getOtpLockKey(email);

    const lockTtl = await redis.ttl(lockKey);

    if(lockTtl > 0){
        return{
            status: "LOCKED" as const,
            retryAfter: lockTtl,
        }
    }

    const otpKey = getOtpKey(email);

    const otpTtl = await redis.ttl(otpKey);

    if(otpTtl > 0){
        return {
            status: "ACTIVE" as const,
            expiresIn: otpTtl,
        };
    }

    return {
        status: "EXPIRED" as const,
    };
};