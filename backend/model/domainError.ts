export class DomainError<TReason extends string> extends Error{
    public readonly reason: TReason;

    constructor(reason : TReason){
        super(reason);
        this.name = "DomainError";
        this.reason = reason;
    }
}