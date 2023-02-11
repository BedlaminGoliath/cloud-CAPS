const Chance = require("chance");
const clientSqs = require("@aws-sdk/client-sqs");

const { SQSClient } = clientSqs;

const REGION = "us-west-2";
const sqsClient = new SQSClient({ region:REGION });

const chance = new Chance();

const QUEUES = {
    Pickup: "https://sqs.us-west-2.amazonaws.com/472017249091/CAPS-Hub-Pickup.fifo"
}

module.exports = { sqsClient, chance, QUEUES };