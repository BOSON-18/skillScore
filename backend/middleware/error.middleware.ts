import { Request, Response, NextFunction } from "express";
import { DomainError } from "../model/domainError";
import { DbError } from "../persistence/db";
import { JobRoleErrorReason } from "../model/error.types";



export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    //Domain expected Errors

    console.log("Logging Error: ", err);

    if (err instanceof DomainError) {
        return res.status(400).json({
            status: "Failed",
            reason: err.reason
        });
    }
    // Infra / DB Error
    if (err instanceof DbError) {
        return res.status(500).json({
            status: "Failed",
            reason: JobRoleErrorReason.INTERNAL_ERROR
        });
    }
    // Fallback(Unknown Error)
    return res.status(500).json({
        status: "FAILED",
        reason: JobRoleErrorReason.INTERNAL_ERROR
    });
}