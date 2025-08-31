import express from "express";
import {serverconfig} from './config/server'
import v1Router from "./routers/v1/index.router"; 
import v2Router from "./routers/v2/index.router";
import logger from "./config/logger.config";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware";
// import { z } from "zod/v4";
import { genericErrorHandler } from "./middlewares/error.middleware";
import { startWorkers } from "./workers/evaluation.worker";
import { pullImages } from "./utils/containers/pullimage.util";
const app=express();
const PORT=serverconfig.PORT;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(attachCorrelationIdMiddleware)
app.use('/api/v1',v1Router)
app.use('/api/v2',v2Router)
app.listen(PORT,async()=>{
logger.info("server started at",PORT);
//whatever we pass in {} in this is taken as data in logger.config file if donot use {} the data obj is empty
logger.info("hello",{data:"hello nick"})


await startWorkers();


logger.info("worker started")
// const obj={
//     name:"nikhil",
//     age:1
// }
await pullImages()
console.log("Imaged pulled successfully")

app.use(genericErrorHandler)
// const objschema=z.object({
//     name:z.string(),
//     age:z.number().int().positive()
// })
// console.log(objschema.parse(obj));
});


