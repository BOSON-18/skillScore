import { Request, Response } from "express";
import { createjobRole, updatejobRole } from "../service/jobRole.service";


export async function createJobRoleController(
    req: Request,
    res: Response
) {
    const role = await createjobRole({
        job_role_id: req.body.job_role_id,
        title: req.body.title,
        requirements: req.body.requirements
    })

    res.status(201).json({
        status: "CREATED",
        job_role_id: role.job_role_id,
        version: role.version
    });
}

type JobRoleParams={
    job_role_id:string
}

export async function updateJobRoleController(
    req: Request<JobRoleParams>,
    res: Response
) {
    const role = await updatejobRole({
        job_role_id: req.params.job_role_id,
        title: req.body.title,
        requirements: req.body.requirements
    });

    res.status(200).json({
        status: "UPDATED",
        job_role_id: role.job_role_id,
        version: role.version
    });
}