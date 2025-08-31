import { Request,Response,NextFunction } from "express";
import { AnyZodObject } from "zod";
import logger from "../config/logger.config";

export const validateRequestBody=(schema:AnyZodObject)=>{
   return async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try {
            await schema.parse(req.body);
            const id=req.headers.correlationId
            console.log(id)
            logger.info("req body is valid",);
            next();
        } catch (error) {
             res.status(400).json({
                message:"invalid object ",
                error:error
            });
        }
    }
}
export const validateQueryParams = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {

            await schema.parseAsync(req.query);
            console.log("Query params are valid");
            next();

        } catch (error) {
            // If the validation fails, 

            res.status(400).json({
                message: "Invalid query params",
                success: false,
                error: error
            });
            
        }
    }
}

export const validateRequestParams = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.params);
            next();
        }
        catch (error) {
            res.status(400).json({
                message: "Invalid request params",
                success: false,
                error: error
            });
        }
    }
}