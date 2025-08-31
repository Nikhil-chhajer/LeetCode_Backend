import { Worker } from "bullmq";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";





async function setupEvaluationWorker(){
    const worker=new Worker("submisison",async(job)=>{
        logger.info("processing the job",job.id);

    },{
        connection:createNewRedisConnection()
    });
    worker.on("error",(error)=>{
        logger.error("evaluation worker error",error)

    })
    worker.on("completed",(job)=>{
        logger.error("evaluation worker completed",job.id)

    })
    worker.on("failed",(job,error)=>{
        logger.error("evaluation worker failed",job?.id,error)

    })
    worker.on("closed",()=>{
        logger.error("evaluation worker closed")

    })
}

export async function startWorkers(){
    await setupEvaluationWorker();
}