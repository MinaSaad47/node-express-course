const nodemailer = require("nodemailer");

const account = nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "lemuel.botsford@ethereal.email",
    pass: "pMBFZdhjvuZNFUrYem",
  },
});

module.exports = async (req, res) => {
  const result = await transporter.sendMail({
    from: "test@email.com",
    to: "email@email.com",
    subject: "testing",
    text: "hello world",
  });

  res.json(result);
};
