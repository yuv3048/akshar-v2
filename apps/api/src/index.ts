import { MessageBatch } from '@cloudflare/workers-types'
import app from './app'
import type { Bindings, OtpEmailJob } from './types'

export default{
    fetch : app.fetch,

    async queue(
        batch:MessageBatch<OtpEmailJob>,
        env:Bindings,
    ){
        for(const message of batch.messages){
            console.log(message.body.email)
            console.log(message.body.otp)

            message.ack()
        }
    },
}


