import axios, { AxiosResponse } from "axios";


import logger from "../config/logger.config";
import { serverconfig } from "../config/server";
import { InternalServerError } from "../utils/app.error";

export interface ITestcase {
    input: string;
    output: string;
}
export interface IProblemDetails {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    editorial?: string;
    testcases: ITestcase[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IProlemReponse {
    data: IProblemDetails;
    message: string;
    success: boolean;
}

export async function getProblemById(problemId: string): Promise<IProblemDetails | null> {
    try {
       const response:AxiosResponse<IProlemReponse>=await  axios.get(`${serverconfig.PROBLEM_SERVICE}/problems/${problemId}`)
       if(response.data.success){
        return response.data.data;
       }
       throw new InternalServerError("problem not found")
    } catch(error) {
        logger.error(`Failed to get problem details: ${error}`);
        return null;
    }
}