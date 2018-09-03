import smtpTransport from '../utils/mailerUtil';
import * as JWT from '../utils/jwtUtils';
import * as userServices from './userService';

export async function sendEmail(email) {
  try {
    // const emailToken = querystring.stringify(await createEmailVerificationToken(email));
    const emailToken = await JWT.createEmailVerificationToken(email);

    const host = process.env.APP_HOST.trim();
    const port = process.env.PORT.trim();
    const link = `http://${host}:${port}/api/users/verifyEmail?token=${emailToken}`;
    const mailOptions = {
      to: email,
      subject: 'Please confirm your Email account',
      html:
        'Hello,<br> Please Click on the link to verify your email.<br><a href="' + link + '">Click here to verify</a>',
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

export async function verifyEmail(emailToken = '') {
  try {
    const res = await JWT.verifyEmail(emailToken);
    if (res) {
      const updatedUser = userServices.activateUser();
      console.log(updatedUser);
    }

    return res;
  } catch (err) {
    throw {
      status: 403,
      statusMessage: 'unauthorized email',
      errMessage: err,
    };
  }
}
