// import { getProblemById } from "../apis/problem.api";
import { getProblemById } from "../apis/problem.api";
import logger from "../config/logger.config";
import { ISubmission, ISubmissionData, SubmissionStatus } from "../models/submission.model";
import { addsubmissionjob } from "../producers/submission.producer";
// import { addSubmissionJob } from "../producers/submission.producer";
import { ISubmissionRepository } from "../repositories/submission.repo";
import { InternalServerError } from "../utils/app.error";


export interface ISubmissionService {
    createSubmission(submissionData: Partial<ISubmission>): Promise<ISubmission>;
    getSubmissionById(id: string): Promise<ISubmission | null>;
    getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]>;
    deleteSubmissionById(id: string): Promise<boolean>;
    updateSubmissionStatus(id: string, status: SubmissionStatus, submissionData: ISubmissionData): Promise<ISubmission | null>;
}

export class SubmissionService implements ISubmissionService {

    private submissionRepository: ISubmissionRepository;

    constructor(submissionRepository: ISubmissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    async createSubmission(submissionData: Partial<ISubmission>): Promise<ISubmission> {
        // check if the problem exists
        if(!submissionData.problemId){
            throw new InternalServerError("problem id is required")
        }
        if(!submissionData.code || !submissionData.language){
            throw new InternalServerError("code and language both are required")
        }
        const problem =await getProblemById(submissionData.problemId)
        if(!problem){
            throw new InternalServerError("Problem not found");
        }
        // add submission to db
        const submission =await this.submissionRepository.create(submissionData);

        // add submission to redis queue
        const jobid=await addsubmissionjob({
            submissionId:submission.id,
            problem,
            code:submissionData.code,
            language:submission.language
        })
            logger.info("submission job added",jobid)
        return submission;
        
    }

    async getSubmissionById(id: string): Promise<ISubmission | null> {
        const submission = await this.submissionRepository.findById(id);
        if(!submission) {
            throw new InternalServerError("Submission not found");
        }
        return submission;
    }

    async getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]> {
        const submissions = await this.submissionRepository.findByProblemId(problemId);
        return submissions;
    }

    async deleteSubmissionById(id: string): Promise<boolean> {
        const result = await this.submissionRepository.deleteById(id);
        if(!result) {
            throw new InternalServerError("Submission not found");
        }
        return result;
    }

    async updateSubmissionStatus(id: string, status: SubmissionStatus, submissionData: ISubmissionData): Promise<ISubmission | null> {
        const submission = await this.submissionRepository.updateStatus(id, status, submissionData);
        if(!submission) {
            throw new InternalServerError("Submission not found");
        }
        return submission;
    }
    
    
}