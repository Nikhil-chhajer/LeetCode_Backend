import {Queue} from "bullmq"
import { createNewRedisConnection } from "../config/redis.config"
import logger from "../config/logger.config";


export const submissionQueue=new Queue("",{
    connection:createNewRedisConnection(),
    defaultJobOptions:{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:2000
        }

    }
});
submissionQueue.on("error",(error)=>{
    logger.error("queue connection error",error)
})
submissionQueue.on("waiting",(job)=>{
    logger.error(`submission jhob waiting ${job.id}`);
})

// export const submissionEvent=new QueueEvents("submission");
// submissionEvent.on("completed",())