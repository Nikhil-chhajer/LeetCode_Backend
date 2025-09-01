
import { commands } from "./commands.utils";
import { createNewDockerContainer } from "./createcontainer.util";

export interface RunCodeOptions{
    code:string,
    language:"python" | "cpp",
    timeout:number,
    image:string
}
export async function runCode(options:RunCodeOptions){
    const {code,language,timeout,image}=options
    
    const container=await createNewDockerContainer({
        imgName:image,
            cmdExecutable:commands[language](code),
            memoryLimit:1024*1024*1024//1gb
    })
    const timeLimitExceedTimeout=setTimeout(()=>{
        console.log("time Limit exceed");
        container?.kill();

    },timeout)
    await container?.start();


    const status=await container?.wait();

    console.log("the status is :",status);
    const logs=await container?.logs({//shows all logs of container
        stdout:true,//output stream logs
        stderr:true//error logs
    })
    console.log("container logs are :",logs?.toString())

    await container?.remove({ force: true }); 
    clearTimeout(timeLimitExceedTimeout);
    if(status.StatusCode==0){
        console.log("container exited successfully")
    }
    else{
        console.log("container exited with error")
    }


}