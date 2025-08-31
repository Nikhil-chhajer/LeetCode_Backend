import Docker from "dockerode";
import logger from "../../config/logger.config";


export interface CreateContainerOptions{
    imgName:string,
    cmdExecutable:string[],
    memoryLimit:number,
}




export async function createNewDockerContainer(options:CreateContainerOptions){
    try {
        const docker=new Docker();
        const container=await docker.createContainer({
            Image:options.imgName,
            Cmd:options.cmdExecutable,//These commands will be executed when container is started
            AttachStderr:true,
            AttachStdin:true,
            AttachStdout:true,
            Tty:false,     // if true then it will provide pseudo terminal but we dont need now
            OpenStdin:true,//keep the input stream open even if no input is found
            HostConfig:{
                Memory:options.memoryLimit,
                PidsLimit:100, // to limit no of process
                CpuQuota:5000,//cpu usage=cpuquota/cpuperiod so it will .5 i.e 50% usage  of each cpu core 
                CpuPeriod:100000,
                SecurityOpt:['no-new-privileges'],//to prevent privilege escalation
                NetworkMode:'none'//to prevent network access
            } 
        })
        logger.info(`container is created with id :${container.id}`)
        return container;
    } catch (error) {
        logger.error("Error creating new Docker container",error)
        return null;
        
    }

}