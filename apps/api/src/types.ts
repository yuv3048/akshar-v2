import type { Queue } from "@cloudflare/workers-types";

export type OtpEmailJob = {
    email: string;
    otp: string;
}

export type Bindings = {
    UPSTASH_REDIS_REST_URL:string;
    UPSTASH_REDIS_REST_TOKEN:string;
    RESEND_API_KEY:string;

    AKSHAR_OTP_EMAIL: Queue<OtpEmailJob>;
}