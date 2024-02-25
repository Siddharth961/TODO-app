const nodemailer = require('nodemailer');

const sendMail = async (options) => {
    //Create transponder
    const transponder = nodemailer.createTransport({
        // host: process.env.MAIL_HOST,
        // port: process.env.MAIL_PORT,
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: `TODO Server <${process.env.GMAIL_USER}`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transponder.sendMail(mailOptions);
};
// sendMail({
//     to: 'asd@gmail.in',
//     subject: 'heyoo',
//     text : 'hugg'
// })
module.exports = sendMail;
