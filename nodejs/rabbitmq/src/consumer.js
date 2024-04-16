const { connection } = require('../server.js');
const amqp = require('amqplib');

async function consumeMessages() {
  try {
    const connectionn = await amqp.connect('amqp://root:placeholder8@rabbitmq.rabbitmq.svc.cluster.local:5672');
    const channel = await connectionn.createChannel();
    const queueName = "hello";

    await channel.assertQueue(queueName);
    console.log(`Waiting for messages in queue: ${queueName}`);

    channel.consume(queueName, (message) => {
      console.log(`Received message: ${message.content.toString()}`);
    }, { noAck: true });
  } catch (error) {
    console.error(error);
  }
}

module.exports = { consumeMessages }
