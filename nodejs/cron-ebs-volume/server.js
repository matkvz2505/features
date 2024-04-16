const express = require("express");
const app = express();
const cron = require("node-cron");

const { createSnapshot } = require("./__init__/snapshot-rabbitmq-ebs");

const PORT = process.env.PORT || 5006;

cron.schedule("14 20 * * *", () => {
  createRoleAndPolicy();
  createSnapshot(async (err) => {
    if (err) {
      console.error(`Error creating Snapshot: ${err.message}`);
      return;
    }
  });
});

app.listen(PORT, () => {
  console.log(`RUNNING IN PORT ${PORT}`);
});