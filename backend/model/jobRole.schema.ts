import { title } from "node:process";
import {z} from "zod";

export const NormalizedRequirementSchema = z.record(z.string(), z.unknown());

export const CreateJobRoleSchema = z.object({
    job_role_id: z.string().min(1),
    title: z.string().min(1),
    requirements: NormalizedRequirementSchema
});

export const UpdateJobRoleSchema = z.object({
    title: z.string().min(1),
    requirements: NormalizedRequirementSchema
})


export type CreateJobRoleInput = z.infer<typeof CreateJobRoleSchema>;
export type UpdateJobRoleInput = z.infer<typeof UpdateJobRoleSchema>;