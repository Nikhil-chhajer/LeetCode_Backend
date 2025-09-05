import { Worker } from "bullmq";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";
import { runCode } from "../utils/containers/codeRunner.utils";
import { LANGUAGE_CONFIG } from "../config/language.config";
import { updateSubmission } from "../apis/submission.api";
export interface TestCase {
    _id:string,
    input: string,
    output: string
}
export interface Problem {
    id: string,
    title: string,
    description: string,
    difficulty: string,
    editorial?: string,
    testcases: TestCase[],
    createdAt: string,
    updatedAt: string
}
export interface EvaluationJob {
    submissionId: string,
    code: string,
    language: "python",
    problem: Problem

}
export interface EvaluationResult {
    status: string,
    output: string | undefined
}
function matchTestCasesWithResult(testCases: TestCase[], results: EvaluationResult[]) {
    const output :Record<string,string>= {}
    if (results.length !== testCases.length) {
        console.log("WA");
        return output;
    }

    try {
        testCases.map((testCase, index) => {
            let retval = "";
            if (results[index].status === 'Time Limit Exceeded') {
                retval = "TLE"
            } else if (results[index].status === 'Failed') {
                retval = "Error"
            } else {
                if (testCase.output === results[index].output) {
                    retval = "AC"
                }
                else {
                    retval = "WA";
                }
            }
            output[testCase._id]=retval;

        })
        return output;

    } catch (error) {
        console.log(error)
    }
}

async function setupEvaluationWorker() {
    const worker = new Worker("submission", async (job) => {
        logger.info("processing the job", job.id);
        const data: EvaluationJob = job.data;
        console.log(data)

        try {
            const testCasesRunnerPromise = data.problem.testcases.map(testcase => {
                return runCode({
                    code: data.code,
                    language: data.language,
                    timeout: LANGUAGE_CONFIG[data.language].timeout,
                    image: LANGUAGE_CONFIG[data.language].imageName,
                    input: testcase.input
                })
            })
            const testCasesRunnerResult: EvaluationResult[] = await Promise.all(testCasesRunnerPromise);
            const output = await matchTestCasesWithResult(data.problem.testcases, testCasesRunnerResult)
            console.log("the output is", output)
            await updateSubmission(data.submissionId,"completed",output || {})
        } catch (error) {
            logger.info("error in running queue")
            console.log(error)

        }


    }, {
        connection: createNewRedisConnection()
    });
    worker.on("error", (error) => {
        logger.error("evaluation worker error", error)

    })
    worker.on("completed", (job) => {
        logger.error("evaluation worker completed", job.id)

    })
    worker.on("failed", (job, error) => {
        logger.error("evaluation worker failed", job?.id, error)

    })
    worker.on("closed", () => {
        logger.error("evaluation worker closed")

    })
}

export async function startWorkers() {
    setupEvaluationWorker();
    logger.info("coming back to worker")
}