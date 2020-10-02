const fs = require("fs");
const AWS = require("aws-sdk");

const BUCKET_NAME = "ebonz-file-system";
const IAM_USER_KEY = "AKIAIRXDFMODVUFGNIQQ";
const IAM_USER_SECRET = "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";

const s3bucket = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
});

function uploadToS3(file) {
  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME,
  });
  s3bucket.createBucket(function () {
    var params = {
      Bucket: BUCKET_NAME,
      Key: file.name,
      Body: file.data,
    };
    s3bucket.upload(params, function (err, data) {
      if (err) {
        console.log("error in callback");
        console.log(err);
      }
      console.log("success");
      console.log(data);
    });
  });
}
