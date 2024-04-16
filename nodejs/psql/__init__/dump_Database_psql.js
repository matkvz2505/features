const moment = require('moment');
const { exec } = require('child_process');
const fs = require('fs-extra');
const AWS = require('aws-sdk');
const dotenv = require("dotenv")

dotenv.config();

const {POSTGRESQL_MASTER_HOST, POSTGRESQL_USER, POSTGRESQL_PASSWORD, AWS_ACCESS_KEY, AWS_SECRET_KEY, REGION, BUCKET_NAME, STAGE} = process.env

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: REGION
});

const s3 = new AWS.S3({});

const bucketName = BUCKET_NAME;

const params = {
  Bucket: bucketName
};

async function createDump(callback) {
  const date = moment().format("YYYYMMDDHHmmss");
  const dumpFilename = `tmp/dump-aaa-${date}.sql`;

  const cmd = `pg_dumpall -h ${POSTGRESQL_MASTER_HOST} -U ${POSTGRESQL_USER} -p 5432 -w -f ${dumpFilename}`;
  console.log(cmd)
  console.log(`Creating dump of all databases in PSQL...`);

  exec(cmd, { env: { PGPASSWORD: POSTGRESQL_PASSWORD } }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating dump: ${error.message}`);
      return callback(error);
    }
    if (stderr) {
      console.error(`Error while creating backup: ${stderr}`);
      return;
    }
    console.log(`dump created successfully: ${stdout}`);
    callback(null, dumpFilename);
  });
  console.log(exec)
}

async function uploadToS3(filename, callback) {
  const fileContent = fs.readFileSync(filename);
  s3.upload({ Bucket: params.Bucket, Key: filename, Body: fileContent}, (err, data) => {
    if (err) {
      console.error(`Error while uploading backup to S3: ${err.message}`);
      return;
    }
    console.log(`Backup uploaded successfully to S3: ${data.Location}`);
    callback(null, data.Location);
  });
}
  
module.exports = {createDump, uploadToS3}