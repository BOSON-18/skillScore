import { Producer } from "kafkajs";
import { kafka } from "./kafka.client";

const TOPIC = "match-requests";

export interface MatchRequestMessage {
    resume_snapshot_id: string,
    job_role_id: string
}

export class MatchRequestsProducer {
    private producer: Producer;

    constructor() {
        this.producer = kafka.producer();
    }

    async connect(): Promise<void> {
        await this.producer.connect();
    }

    async disconnect(): Promise<void> {
        await this.producer.disconnect();
    }


    async publish(message: MatchRequestMessage): Promise<void> {
        await this.producer.send({
            topic: TOPIC,
            messages: [
                {
                    key: message.resume_snapshot_id,
                    value: JSON.stringify(message)
                }
            ]
        })
    }
}