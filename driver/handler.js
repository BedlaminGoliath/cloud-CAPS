const { 
    ReceiveMessageCommand,
    DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const { sqsClient, QUEUES, chance } = require("../utils");

function deliver(orderId){
    console.log("Driver Finished the delivery", orderId);
    handlePickup();
}

async function handlePickup(){
    try { 
        const recieved = await sqsClient.send(
            new ReceiveMessageCommand({
                QueueUrl: QUEUES.Pickup,
            })
        );
        if(recieved.Messages?.length>0) {
            await sqsClient.send(
                new DeleteMessageCommand({
                    QueueUrl: QUEUES.Pickup,
                    ReceiptHandle: recieved.Messages[0].ReceiptHandle,
                })
            );
        const payload = JSON.parse(recieved.Messages[0].Body);
        console.log("driver recieved a pickup event!", payload);
        setTimeout(
            ()=>deliver(payload.orderId),
            chance.integer({ min: 5000, max: 7000 })
        );
        } else {
            console.log("No pickup ready");
            setTimeout(handlePickup, 5000);
        }
    } catch (e) {
        console.error("Failed to handlePickUp", e);
    }
}

function startDriver(){
    console.log("driver ready!");
    handlePickup();
}

module.exports = {
    startDriver,
}