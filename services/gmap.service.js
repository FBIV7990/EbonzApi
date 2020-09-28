var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google', 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyCFU9xoXBEkIUAm2XWJj7jlkerEaITusWY', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
var geocoder = NodeGeocoder(options);
exports.getAddress=(latitude,longitude)=>
{ 
  return new Promise((resolve,reject)=>{
    geocoder.reverse({lat:latitude, lon:longitude})
  .then(function(res) {   
    resolve(res);
  })
  .catch(function(err) {
    reject(err);
  });
 })
}