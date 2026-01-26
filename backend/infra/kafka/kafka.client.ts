import {Kafka} from "kafkajs"

export const kafka = new Kafka({
    clientId: "skillscore-api",
    brokers: [process.env.KAFKA_BROKER!]
})