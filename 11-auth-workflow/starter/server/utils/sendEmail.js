const nodemailer = require("nodemailer");
const nodeMailerConfig = require("./nodeMailerConfig");

let testAccount = nodemailer.createTestAccount();
const transporter = nodemailer.createTransport(nodeMailerConfig);

module.exports = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: "Email Verification <emailverification@email.com>", // sender address
    to,
    subject,
    html,
  });
};
