const { connection } = require('../server.js');
const amqp = require('amqplib');

async function publishMessage() {
  try {
    const connectionn = await amqp.connect('amqp://root:placeholder8@rabbitmq.rabbitmq.svc.cluster.local:5672');
    const channel = await connectionn.createChannel();
    const queueName = "hello";
    const message = "Hello, world!";

    await channel.assertQueue(queueName);
    await channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Sent message: ${message}`);

    await channel.close();
    await connectionn.close();
  } catch (error) {
    console.error(error);
  }
}

module.exports = { publishMessage }
