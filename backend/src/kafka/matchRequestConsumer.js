const { kafka } = require("./KafkaClient");
const { runWorker } = require("../worker");


const topic = process.env.KAFKA_MATCH_TOPIC || "match-requests";
const groupId = process.env.KAFKA_CONSUMER_GROUP || "skillscore-match-workers";

async function startMatchRequestConsumer() {

    const consumer = kafka.consumer({ groupId });

    await consumer.connect();
    console.log("[consumer] connected to Kafka");
    await consumer.subscribe({ topic, fromBeginning: false });
    console.log("[consumer] listening to topic: ", topic);

    await consumer.run({
        autoCommit: true,
        eachMessage: async ({ message }) => {
            if (!message.value) {
                console.warn("[consumer] empty message");
                return;
            }

            let payload;
            try {
                payload = JSON.parse(message.value.toString());
                console.log("[consumer] parsed paylaod ", payload);
            } catch (err) {
                console.error("[consumer] invalid JSON payload ", err);
                return;
            }

            const { resumeSnapshotId, jobRoleId } = payload;

            if (!resumeSnapshotId || !jobRoleId) {
                console.error("[consumer] invalid payload shape", payload);
                return; // ACK and skipped
            }


            try {
                await runWorker({
                    resumeSnapshotId,
                    jobRoleId
                });
            } catch (err) {
                console.error("[consumer] worker execution failed", err);
                // throw coz then kafka will retry on infra failure
                throw err;
            }
        }
    })
}
module.exports = { startMatchRequestConsumer }