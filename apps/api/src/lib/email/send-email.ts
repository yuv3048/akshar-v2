import { render } from "@react-email/render"
import { VerificationOtpEmail } from "@akshar/email/templates/VerificationOtpEmail"

import type { Bindings } from "../../types";
import { createResend } from "./resend";

type SendVerificationOtpEmailParams = {
    email: string,
    otp: string;
};

const LOGO_URL =
    "https://res.cloudinary.com/icf0ttng/image/upload/v1790495747/akshar.png";


export const sendVerificationOtpEmail = async (
    env: Bindings,
    { email, otp }: SendVerificationOtpEmailParams,
)=>{

    const resend = createResend(env);

    const verificationUrl = `${env.APP_URL}/verify-email`

    const html = await render(
        VerificationOtpEmail({
            verificationCode: otp,
            verificationUrl,
            logoUrl: LOGO_URL,
        }),
    );

    const {data, error} = await resend.emails.send({
        from: "Akshar <onboarding@resend.dev>",
        to: email,
        subject: "Your Akshar verification code",
        html,
    })

    if(error){
        throw new Error(`Failed to send verification email:${error.message}`);
    }

    return data;
}
