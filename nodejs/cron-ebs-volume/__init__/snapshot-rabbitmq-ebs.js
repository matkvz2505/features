const AWS = require("aws-sdk");
const dotenv = require("dotenv")

dotenv.config();

const { 
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    REGION,
    BUCKET_NAME
  } = process.env;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: REGION
});

const ebs = new AWS.EBS();

const s3 = new AWS.S3({});

const params = {
    VolumeId: '',
    Description: 'My snapshot EKS',
};

async function createSnapshot(callback) {
    try {
        const snapshotResponse = await ebs.createSnapshot(params).promise();
        console.log('Snapshot created:', snapshotResponse.SnapshotId);
        console.log(BUCKET_NAME)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createSnapshot}