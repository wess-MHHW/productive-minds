const nodemailer = require("nodemailer");

module.exports = async (option) => {
  // CREATE TRANSPORTER
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // SET EMAIL OPTIONS
  const emailOptions = {
    from: "PRODUCTIVE MIND support<support@productive-mind.com>",
    to: option.email,
    subject: option.subject,
    text: option.text,
  };

  // SEND EMAIL
  await transporter.sendMail(emailOptions);
};
