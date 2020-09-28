var http = require('http');
var urlencode = require('urlencode');
var apiKey="H7M6D5kb3Mw-UAryUdOwWpj7OygFT85OFQ7Vppfzr7"; // The hash key could be found under Help->All Documentation->Your hash key. Alternatively you can use your Textlocal password in plain text.
 var sender = "EBONZZ";


exports.sendSMS = (mobile, OTP) => {
  new Promise((resolve, reject) => {
    var msg = urlencode("Welcome to EBONZ, %nYour verification code is "+OTP+". %nJust enter this code to verify your number.%nThank You,%nEBONZ Team,%n New Delhi, India");
    var number = mobile;
    var data =
      "apikey=" +
      apiKey +
      "&numbers=" +
      number +
      "&sender=" +
      sender +          
      "&message=" +
      msg;
    var options = {
      host: "api.textlocal.in",
      path: "/send/?" + data
    };
console.log(options);

//https://api.textlocal.in/send/?apikey=H7M6D5kb3Mw-UAryUdOwWpj7OygFT85OFQ7Vppfzr7&numbers=918447777757&sender=EBONIN&message=Welcome to EBON, %nYour verification code is x. %nJust enter this code to verify your number.%nThank You,%nEBON Team,%n New Delhi, India

    const req = http.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`);
      resolve(res);
      res.on("data", d => {
        process.stdout.write(d);
      });
    });

    req.on("error", error => {
      reject(error);
      console.error(error);
    });

    req.write(data);
    req.end();
  });
};
