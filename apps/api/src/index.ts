import { MessageBatch } from '@cloudflare/workers-types'
import app from './app'
import type { Bindings, OtpEmailJob } from './types'
import { SendOtpEmail } from './lib/email'

export default{
    fetch : app.fetch,

    async queue(
        batch:MessageBatch<OtpEmailJob>,
        env:Bindings,
    ){
        for(const message of batch.messages){
            try{
                await SendOtpEmail(env.RESEND_API_KEY, message.body);

                message.ack();
            }catch (error){
                console.error("Failed to send OTP email:", error);

                message.retry();
            }
    
        }
    },
}


