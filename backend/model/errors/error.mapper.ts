import { DbError } from "../../persistence/db";
import { JobRoleErrorReason } from "./error.types";


export function mapjobRoleError(err: unknown): JobRoleErrorReason {

    if (err instanceof DbError) {
        switch (err.code) {
            case "23505": // unique_violation
                return JobRoleErrorReason.DUPLICATE_ROLE;
            default:
                return JobRoleErrorReason.INTERNAL_ERROR;
        }
    }

    return JobRoleErrorReason.INTERNAL_ERROR;
}