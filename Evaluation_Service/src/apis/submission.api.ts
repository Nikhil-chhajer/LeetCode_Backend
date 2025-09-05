import axios from "axios";
import logger from "../config/logger.config";
import { serverconfig } from "../config/server";
import { InternalServerError } from "../utils/app.error";


export async function updateSubmission(submissionId: string, status: string, output: Record<string, string>) {
    try {
        console.log(serverconfig.SUBMISSION_SERVICE)
        const url = `${serverconfig.SUBMISSION_SERVICE}/submission/${submissionId}/status`;
        logger.info("Getting problem by ID", { url });
        const response = await axios.patch(url, {
            status,
            submissionData: output
        });

        if(response.status !== 200) {
            throw new InternalServerError("Failed to update submission");
        }
        console.log("Submission updated successfully", response.data);
        return;

    } catch(error) {
        logger.error(`Failed to update submission: ${error}`);
        return null;
    }
}