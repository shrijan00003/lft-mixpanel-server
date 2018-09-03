import smtpTransport from '../utils/mailerUtil';
import { createEmailVerificationToken } from '../utils/jwtUtils';

export async function sendEmail(req, res, next) {
  const userEmail = req.body.user_email;
  console.log(userEmail);

  const emailToken = await createEmailVerificationToken(userEmail);
  const host = process.env.APP_HOST;
  const link = `http://${host}/users/verifyEmail?token=${emailToken}`;
  const mailOptions = {
    to: userEmail,
    subject: 'Please confirm your Email account',
    html: 'Hello,<br> Please Click on the link to verify your email.<br><a href=' + link + '>Click here to verify</a>',
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
      res.json('error');
    } else {
      console.log('Message sent: ' + response.message);
      res.json('message sent to ');
      next();
    }
  });
}
