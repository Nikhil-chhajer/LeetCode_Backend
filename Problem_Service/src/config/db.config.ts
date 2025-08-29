import mongoose from "mongoose";
import logger from "./logger.config";
import { serverconfig } from "./server";


export const connectDB=async()=>{
    try {
        const dbUrl= serverconfig.DB_URL;
        await mongoose.connect(dbUrl);
        logger.info("connected to MONGO DB")
        mongoose.connection.on("error",(error)=>{
            logger.error("Mongo DB connection error",error)
        })
        mongoose.connection.on("disconnected",()=>{
            logger.error("Mongo DB connection disconnected Manually")
        })
        //signint is used to disconnect the mongoDB
        process.on("SIGINT",async()=>{
            await mongoose.connection.close();
            logger.info("MONGO DB got disconnected")
            process.exit(0);
        })
    } catch (error) {
        logger.error("failed to connect to MongoDb",error);
        process.exit(1);
    }
}