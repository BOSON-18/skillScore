export class ResumeTimeoutError extends Error {
  constructor(message = "Resume service timeout") {
    super(message);
    this.name = "ResumeTimeoutError";
  }
}

export class ResumeUpstreamError extends Error {
  constructor(message = "Resume service unavailable") {
    super(message);
    this.name = "ResumeUpstreamError";
  }
}

export class ResumeNotFoundError extends Error {
  constructor(message = "Resume snapshot not found") {
    super(message);
    this.name = "ResumeNotFoundError";
  }
}

export class ResumeMalformedError extends Error {
  constructor(message = "Resume snapshot malformed") {
    super(message);
    this.name = "ResumeMalformedError";
  }
}
