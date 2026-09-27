import { MessageBatch } from '@cloudflare/workers-types'
import app from './app'
import type { Bindings, OtpEmailJob } from './types'
import { sendVerificationOtpEmail } from './lib/email/send-email'

export default{
    fetch : app.fetch,

    async queue(
        batch:MessageBatch<OtpEmailJob>,
        env:Bindings,
    ){
        for(const message of batch.messages){
            try{
                await sendVerificationOtpEmail(env, message.body);

                message.ack();
            }catch (error){
                console.error("Failed to send verification email:", error);

                message.retry();
            }
    
        }
    },
}


