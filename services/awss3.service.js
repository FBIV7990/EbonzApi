const AWS = require('aws-sdk');
const fs=require('fs');

const BUCKET_NAME = 'ebonz-file-system';
const IAM_USER_KEY = 'AKIAIRXDFMODVUFGNIQQ';
const IAM_USER_SECRET = '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';

const s3bucket = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET
});

module.exports={uploadFile}

 function uploadFile(file)
 {
    return new Promise((resolve,reject)=>{
        var params = {
           ACL: 'public-read',    
           Bucket: BUCKET_NAME,
           Key: file.name,
           Body: fs.createReadStream(file.path),
           ContentType: file.mimetype
          };      

         return s3bucket.upload(params, function (err, data) {
           if (err) {
               reject(err);
            console.log('error in callback');
            console.log(err);
           }
          // console.log(data);
          // console.log(data);
           resolve(data);
          });
    }) 
}