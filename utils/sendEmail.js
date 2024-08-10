const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT, // if secure: true, port: 465 else port: 587
    secure: true,
    auth: {
      user: process.env.MAILER_USERNAME,
      pass: process.env.MAILER_PASSWORD,
    },
  });
  // 2) define the email options {from, to, subject, text}
  const mailOpts = {
    from: `E-shop App <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) send the email
  const info = await transporter.sendMail(mailOpts);
  console.log(info);

  // 4) handle the response
  console.log(`Email sent to ${options.email}`);
};

module.exports = sendEmail;
