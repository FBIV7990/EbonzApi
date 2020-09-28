
const portNumber=4000;
module.exports={getServerUrl,sanitizeFile,moveFile,createKeyfromName}
function getServerUrl(req)
{
    if(req)
   { 
       const host = req.hostname+"/api";
       return  serverUrl = req.protocol + "://" + host + '/'  
    }
}

function sanitizeFile(file, cb,fileExts) {
    // Define the allowed extension
    //let fileExts = ['png', 'jpg', 'jpeg','mp4']
    console.log(file);
    // Check allowed extensions
    let isAllowedExt = fileExts.includes(file.originalname.split('.')[1].toLowerCase());
    // Mime type must be an image
     let isAllowedMimeType = file.mimetype.startsWith("image/")||file.mimetype.startsWith("video/")||file.mimetype=="application/pdf"||file.mimetype=="application/octet-stream"
   
   
   
    //let isAllowedMimeType = file.mimetype.startsWith("video/")
    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true) // no errors
    }
    else {
        // pass error msg to callback, which can be displaye in frontend
        cb('Error:File type not allowed!');
    }
  }


//   //moves the $file to $dir2
// function moveFile(file, dir2){
//     //include the fs, path modules
//     var fs = require('fs');
//     var path = require('path');
  
//     //gets file name and adds it to dir2
//     var f = path.basename(file);
//     var dest = path.resolve(dir2, f);
  
//     fs.rename(file, dest, (err)=>{
//       if(err)
//       console.log(err)// throw err;
//       else{return "File moved successfully!";}
//     });
//   };

  function moveFile(file,dir2)
  {
    return new Promise((resolve,reject)=>{
       //include the fs, path modules
    var fs = require('fs');
    var path = require('path');
  
    //gets file name and adds it to dir2
    var f = path.basename(file);
    var dest = path.resolve(dir2, f);
  
    fs.rename(file, dest, (err)=>{
      if(err)
      reject({success:false,error:err})
      else{resolve({success:true})}
    });
    })

  }
  
//Convert a string name to a key name
  function createKeyfromName(name){
    // const str= name.replace(/[^a-zA-Z ]/g, "");
    // const newstr= str.replace(" ","_");
    const newstr= name.replace(/[^A-Z0-9]+/ig, "_");
    return newstr.toLowerCase();
  }