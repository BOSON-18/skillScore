const { startMatchRequestConsumer } = require("./kafka/matchRequestConsumer");


async function start() {
    try {
await startMatchRequestConsumer()
    } catch (err) {
        console.error("[consumer] fatal error", err);
        process.exit(1);
    }
}


start();