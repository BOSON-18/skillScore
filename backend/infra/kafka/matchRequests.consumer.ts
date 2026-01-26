import { Response } from "express";
import { MatchIdentity } from "../../model/matchResultModel/matchResult.types";
import { getlatestJobRoleVersion } from "../../persistence/jobRole.persistence";
import { MatchResultPersistence } from "../../persistence/matchResults.persistence";
import { kafka } from "./kafka.client";
import { snapshot } from "node:test";
import { clear } from "node:console";



const TOPIC = "match-requests";
const GROUP_ID = "match-workers";
const RESUME_TIMEOUT_MS = 2000;
export class MatchRequestsConsumer {
    private readonly persistence: MatchResultPersistence;

    constructor(persistence: MatchResultPersistence) {
        this.persistence = persistence;
    }

    async start(): Promise<void> {
        const consumer = kafka.consumer({ groupId: GROUP_ID });

        await consumer.connect();
        await consumer.subscribe({ topic: TOPIC, fromBeginning: false });

        await consumer.run({
            // each message gives us per-message control

            eachMessage: async ({ message }) => {
                if (!message.value) return;

                const payload = JSON.parse(message.value.toString());

                const resumeSnapshotId = payload.resume_snapshot_id;
                const jobRoleId = payload.job_role_id;

                // step 1 -> fetch the latest job role version by using the job id from the message
                const jobRoleVersion = await this.getLatestRoleVersion(jobRoleId); // TODO; implement it latere

                const identity: MatchIdentity = {
                    resumeSnapshotId,
                    jobRoleId,
                    jobRoleVersion
                }

                // step 2: calim the ownership of the match job
                const claimed = await this.persistence.claimMatch(identity);


                if (!claimed) return; // means duplicate or alkready processed -> ACK by return

                try {

                    // step 3: fetch resume snapshot  (TODO)
                    const resume = await this.fetchResumeSnapshot(resumeSnapshotId); // TODO: implement it later
                    // Step 4: Compute score (TODO)
                    const { score, explanation } = await this.computeScore(resume); // TODO: implement it later

                    // STEP 5 persist success
                    await this.persistence.markAvailable(
                        identity,
                        score,
                        explanation
                    );

                } catch (err: any) {
                    //terminal falures only
                    await this.persistence.markFailed(
                        identity,
                        "PROCESSING_ERROR"
                    )

                }
            }
        })
    }


    private async getLatestRoleVersion(jobRoleId: string): Promise<number> {
        const jobRole = await getlatestJobRoleVersion(jobRoleId);
        if (!jobRole) {
            throw new Error("Job Role not found");
        }
        return jobRole.version;
    }




    private async fetchResumeSnapshot(resumeSnapshotId: string): Promise<any> {
        // return {}; // To DO -> implement later
        let res: Response;

        const controller = new AbortController();
        const timeoutMS = 3000;

        const timeout = setTimeout(() => {
            controller.abort();
        }, timeoutMS);



        try {

            const response = await fetch(`${process.env.RESUME_SERVICE_BASE_URL}/resume-snapshots/${resumeSnapshotId}`,
                {
                    method: "GET",
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            if (!response.ok) {
                // 4xx-> bad snapshot or not found -> terminal
                if (response.status >= 400 && response.status < 500) {
                    throw new Error("MALFORMED_SNAPSHOT");
                }
                throw new Error("UPSTREAM_UNAVAILABLE");
            }

            const data = await response.json();

            if (!data || typeof data !== "object" || !data.skills || !data.experience) {
                throw new Error("MALFORMED_SNAPSHOT");
            }

            return data;

        } catch (err: any) {

            if (err.name === "AbortError") {
                throw new Error("UPSTREAM_TIMEOUT");
            }

            throw err;

        } finally {
            clearTimeout(timeout);
        }
    }

    private computeScore(resume: any): {
        score: number;
        explanation: any;
    } {
        return { score: 0, explanation: {} };
    }
}



// Never implement retries on top of Kafka unless you need custom backoff or DLQs.

