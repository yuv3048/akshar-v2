import { Resend } from "resend";

type SendOtpEmailInput = {
    email:string;
    otp:string;
};

export const SendOtpEmail = async(
    apiKey: string,
    data: SendOtpEmailInput,
)=>{
    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
        from: "Akshar <noreply@yourdomain.com>",
        to: data.email,
        subject: "Your Akshar verification code",
        html:`
            <h2>Verify your email</h2>
            <p>Your Akshar verification code is:<p>
            <h1>${data.otp}</h1>
            <p>This code expires in 7 minutes.</p>
        `
    });
}