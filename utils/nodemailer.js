const nodemailer = require("nodemailer");
const appConfig = require("../config/appConfig");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: appConfig.smtp_host,
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: appConfig.smtp_user,
    pass: appConfig.smtp_pass,
  },
});

// Function to send an email
const sendEmail = (name, email, subject, password) => {
  try {
    const mailOptions = {
      from: appConfig.smtp_user,
      to: email,
      subject: subject,
      html: `
  <h2>Welcome to ${appConfig.app_name}</h2>

  <p>Hello <b>${name}</b>,</p>

  <p>Your account has been successfully created.</p>

  <p>
    <b>Email:</b> ${email} <br/>
    <b>Password:</b> ${password}
  </p>

  <p style="color:red;">
    For security reasons, please change your password after first login.
  </p>

  <p>If you did not request this account, please contact support.</p>

  <br/>
  <p>Thanks,<br/>${appConfig.app_name} Team</p>
`,
    };
    return transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to send an email
const sendInvitationEmail = (email, message) => {
  try {
    const mailOptions = {
      from: appConfig.smtp_user,
      to: email,
      subject: 'Welcome to the Application.',
      html: message,
    };
    return transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail, sendInvitationEmail };
