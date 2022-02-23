"use strict";


const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const mailHelper = async function main(option) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER , // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });

  const message = {
    from: 'abinjola.binjola@gmail.com', // sender address
    to: option.emailTo, // list of receivers
    subject: option.subject, // Subject line
    text: option.message, // plain text body
  }

  // send mail with defined transport object
   await transporter.sendMail(message);

}



module.exports = mailHelper;