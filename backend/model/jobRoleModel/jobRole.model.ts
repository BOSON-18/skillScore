import {NormalizedRequirements} from "./jobRole.dto";

export interface JobRole{
    job_role_id:string;
    version:number;
    title:string;
    requirements:NormalizedRequirements;
}