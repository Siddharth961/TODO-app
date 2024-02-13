const nodemailer = require('nodemailer');


const sendMail = async (options) => {
    //Create transponder
    const transponder = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailOptions = {
        from: ' Siddharth Jain <todo@server.in>',
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
module.exports = sendMail
