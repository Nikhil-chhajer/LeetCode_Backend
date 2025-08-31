import Docker from "dockerode"
import { CPP_IMAGE, PYTHON_IMAGE } from "../helpers/constants";
import logger from "../../config/logger.config";




export async function pullImage(image: string) {
    const docker = new Docker();
    return new Promise((res, rej) => {
        docker.pull(image, (err: Error, stream: NodeJS.ReadableStream) => {
            if (err) return err;

            docker.modem.followProgress(stream, function onFinished(finalerr, output) {
                if (finalerr) return rej(finalerr);
                res(output);
            },
                function onProgress(event) {
                    console.log(event.status)
                })
        })
    });
}

export async function pullImages (){
    const images=[PYTHON_IMAGE,CPP_IMAGE];
    //parallel start pull both these images
    const promises=images.map((image)=>pullImage(image));// map immediately call pull image for all elements in array does not wait for one to complete and goes for second and we can achieve parallelism through this thats promises.all to wait untill all promises is complete and if any of promise fails  it return error
    try{
        await Promise.all(promises);
        logger.info("all images pulled successfully")
    }
    catch(error){
        logger.error("error pulling the images",error);


    }
}