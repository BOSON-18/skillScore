import {NormalizedRequirements} from "./jobRole.dto";

export interface jobRole{
    job_role_id:string;
    version:number;
    title:string;
    requirements:NormalizedRequirements;
}