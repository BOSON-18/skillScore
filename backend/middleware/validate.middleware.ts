import { Request,Response,NextFunction } from "express";
import { ZodSchema } from "zod";
import { DomainError } from "../model/domainError";
import { JobRoleErrorReason } from "../model/error.types";




export function validateBody(schema: ZodSchema){


    return (req:Request,_res:Response,next:NextFunction)=>{

        const result = schema.safeParse(req.body);

        if(!result.success){
            console.log("Throwing validation error:", result.error);
            throw new DomainError(JobRoleErrorReason.INVALID_REQUIREMENTS);
    }

    req.body = result.data;
    next();

}
}