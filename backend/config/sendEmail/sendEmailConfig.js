const nodemailer = require('nodemailer');
 
 
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pascalazubike003@gmail.com',
        pass: 'eyauommonhdmdebv'
    }
});
 
module.exports = mailTransporter