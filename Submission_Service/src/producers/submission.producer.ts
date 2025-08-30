
import { IProblemDetails } from "../apis/problem.api";
import logger from "../config/logger.config";
import { SubmissionLanguage } from "../models/submission.model";
import { submissionQueue } from "../queue/submission.queue";

export interface ISubmissionJob{
    submissionId:string,
    problem:IProblemDetails,
    code:string,
    language:SubmissionLanguage,
}


export async function addsubmissionjob(data:ISubmissionJob):Promise<null|string>{
    try{
        const job=await submissionQueue.add("evaluate-submission",data);
        logger.info("submission job added",job.id)
        return job.id||null;
    }
    catch(error){
        logger.error("failed to add job to queue",error)
        return null;

    }

}