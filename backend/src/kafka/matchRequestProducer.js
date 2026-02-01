const { kafka } = require("./KafkaClient");

const topic = process.env.KAFKA_MATCH_TOPIC || "match-requests";

let producer;
async function getProducer() {
    if (!producer) {
        console.log("Creating producer")
        producer = kafka.producer({
            allowAutoTopicCreation: true
        });
        await producer.connect();
    }

    return producer;
}

// Publish a match request
// Fire and forget -> No DB no retries here

async function publishMatchRequest({ resumeSnapshotId, jobRoleId }) {
    if (!resumeSnapshotId || !jobRoleId) {
        throw new Error("resumeSnapshotId and jobROleId are required");
    }

    const p = await getProducer();

    await p.send({
        topic,
        messages: [
            {
                key: resumeSnapshotId,
                value: JSON.stringify({
                    resumeSnapshotId,
                    jobRoleId
                })
            }
        ]
    });
}

module.exports = { publishMatchRequest };