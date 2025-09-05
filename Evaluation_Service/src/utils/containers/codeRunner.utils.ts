
import { commands } from "./commands.utils";
import { createNewDockerContainer } from "./createcontainer.util";
import fs from "fs";
export interface RunCodeOptions {
    code: string,
    language: "python" | "cpp",
    timeout: number,
    image: string,
    input?: string
}
export async function runCode(options: RunCodeOptions) {
    const { code, language, timeout, image, input } = options
    // console.log(timeout)
    const container = await createNewDockerContainer({
        imgName: image,
        cmdExecutable: commands[language](code, input),
        memoryLimit: 1024 * 1024 * 1024,//1gb,

    })


    let isTimelimitExceeded=false;
    const timeLimitExceedTimeout = setTimeout(() => {
        console.log("time Limit exceed");
        isTimelimitExceeded=true
        container?.kill();

    }, timeout)
    await container?.start();
    if(isTimelimitExceeded){
        await container?.remove();
        return {
            status:"Time Limit Exceeded",
            output:"Time Limit Exceeded"
        }
    }


    const status = await container?.wait();

    console.log("the status is :", status);
    const logs = await container?.logs({//shows all logs of container
        stdout: true,//output stream logs
        stderr: true//error logs
    })
    // const sampleoutput="helo World\n7\n"
  
   const containerlogs=processLogs(logs)
    fs.writeFileSync("logs.txt", containerlogs || '')
    console.log("constainer logs are:",containerlogs)
 
    await container?.remove({ force: true });
    clearTimeout(timeLimitExceedTimeout);
    if (status.StatusCode == 0) {
        console.log("container exited successfully")
        return {
            status:"success",
            output:containerlogs

        }
    }
    else {
        
        console.log("container exited with error")
        return{
             status:"Failed",
             output:"Failed"
        }
    }


}
function processLogs(logs:Buffer | undefined){
    return logs?.toString('utf-8').
        replace(/\x00/g, '')//remove all null bytes
        .replace(/[\x00-\x09\x0B-\x1F-\x9F]/g, '')//remove control characters except \n (0x0A)
        .trim() 

}