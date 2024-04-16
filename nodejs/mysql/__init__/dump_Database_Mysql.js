const moment = require('moment');
const { exec } = require('child_process');
const fs = require('fs-extra');
const AWS = require('aws-sdk');
const { connection } = require('../server.js')

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const REGION= process.env.REGION;
const BUCKET_NAME= process.env.BUCKET_NAME;

const MYSQL_HOST = process.env.MYSQL_HOST;
// const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
// const MYSQL_USER = process.env.MYSQL_USER;

// ### root ###
const MYSQL_USER_ROOT = process.env.MYSQL_USER_ROOT;
const MYSQL_ROOT_PASSWORD = process.env.MYSQL_ROOT_PASSWORD;
const STAGE = process.env.STAGE;

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
  const dumpFilename = `tmp/dump-${STAGE}-mysql-latest.sql`;

  const cmd = `mysqldump -h ${MYSQL_HOST} -P 3306 -u ${MYSQL_USER_ROOT} -p${MYSQL_ROOT_PASSWORD} --all-databases > ${dumpFilename}`;
  console.log(`Creating dump of all databases in MySQL...`);
  console.log(cmd)
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating dump: ${error.message}`);
      return callback(error);
    }
    console.log(`dump created successfully: ${dumpFilename}`);
    callback(null, dumpFilename);
  });
}

async function uploadToS3(filename, callback) {
  const fileContent = fs.readFileSync(filename);
  const body = {
    Bucket: params.Bucket,
    Key: filename,
    Body: fileContent,
  };
  console.log(`Uploading dump to S3 bucket...`);
  console.log(body)
  s3.upload(body, (err, data) => {
    if (err) {
      console.error(`Error uploading dump to S3 bucket: ${err.message}`);
      return callback(err);
    }
    console.log(`dump uploaded successfully: ${data.Location}`);
    callback(null, data.Location);
  });
}

module.exports = {createDump, uploadToS3}