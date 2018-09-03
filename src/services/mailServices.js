import smtpTransport from '../utils/mailerUtil';
import { createEmailVerificationToken } from '../utils/jwtUtils';

export async function sendEmail(email) {
  try {
    const emailToken = await createEmailVerificationToken(email);
    const host = process.env.APP_HOST.trim();
    const port = process.env.PORT.trim();
    // const link = `http://127.0.0.1:8848/api/users/verifyEmail?token=${emailToken}`;
    const link = `http://${host}:${port}/api/users/verifyEmail?token=${emailToken}`;
    const mailOptions = {
      to: email,
      subject: 'Please confirm your Email account',
      html:
        'Hello,<br> Please Click on the link to verify your email.<br><a href=' + link + '>Click here to verify</a>',
    };

    smtpTransport.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.log('error', error, 'response', response);

        return false;
      } else {
        console.log(`Email is sent to ${email} the response is ${response}`);

        return true;
      }
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
}
