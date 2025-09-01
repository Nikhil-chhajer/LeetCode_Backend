import { PYTHON_IMAGE } from "../helpers/constants";
import { createNewDockerContainer } from "./createcontainer.util";


export async function runPythonCode(pythonCode:string){
    const runCommand=`echo '${pythonCode}'>code.py && python3 code.py`;
    const container=await createNewDockerContainer({
        imgName:PYTHON_IMAGE,
            cmdExecutable:['/bin/bash','-c',runCommand],// '/bin/bash make sure terminal is runned and '-c' flag make sure that following string will be run as command 
            memoryLimit:1024*1024*1024//2gb
    })

    await container?.start();


    const status=await container?.wait();

    console.log("the status is :",status);
    const logs=await container?.logs({//shows all logs of container
        stdout:true,//output stream logs
        stderr:true//error logs
    })
    console.log("container logs are :",logs?.toString())

   try {
        await container?.remove({ force: true }); 
    } catch (err) {
        console.warn("Container already removed/stopped:", err);
    }

}