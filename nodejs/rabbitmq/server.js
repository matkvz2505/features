const express = require('express');
const app = express();
const amqp = require('amqplib');
const cron = require('node-cron');

const { publishMessage } = require("./src/publisher")
const { consumeMessages } = require("./src/consumer");

const CONN_URL = '';

const connection = async(req, res) => { 
  amqp.connect(CONN_URL, function (err, conn) {
    conn.createChannel(function (err, channel) {
       ch = channel;
    });
    console.log(`message err ${err}`)
 });
}

cron.schedule('* * * * *', () => {
  publishMessage();
  consumeMessages();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`RUNNING IN PORT ${PORT}`)
});

module.exports = { connection }