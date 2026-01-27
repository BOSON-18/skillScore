class JobRoleNotFoundError extends Error {
    constructor(message = "Job role not found") {
        super(message);
        this.name = "JobRoleNotFoundError"
    }
}

class InvalidJobRoleInputError extends Error {
    constructor(message = "Invalid job role input") {
        super(message);
        this.name = "InvalidJobRoleInputError"
    }
}

class JobRoleConflictError extends Error {
    constructor(message = "Job role conflict") {
        super(message);
        this.name = "JobRoleConflictError"
    }

}


module.exports = {
    JobRoleConflictError, JobRoleNotFoundError, InvalidJobRoleInputError
}