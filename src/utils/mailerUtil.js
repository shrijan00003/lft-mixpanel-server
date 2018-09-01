import nodemailer from 'nodemailer';

const smptTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ganga00003@gmail.com',
    pass: 'mynepal12',
  },
});

export default smptTransport;
