var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "support@ebonz.in",
    pass: "Vincy1980$",
  },
});

exports.sendMail = (email, OTP) => {
  new Promise((resolve, reject) => {
    var mailOptions = {
      from: "support@ebonz.in",
      to: email,
      subject: OTP + " is your Security code for EbonZ account",
      text:
        "Welcome to EBONZ,\n Please confirm your email address.\n Your verification code is : " +
        OTP +
        "\n\nThanks,\n EBONZ Team.\nWeb:www.ebonz.in",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve("mail sent");
        console.log("Email sent: " + info.response);
      }
    });
  });
};
