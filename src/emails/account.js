const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kiko_bt_@hotmail.com',
        subject: `Thank you for joining the Task Manager API.`,
        text: `Welcome to the API, ${name}. If you have any questions feel free to send an email.`
    });
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kiko_bt_@hotmail.com',
        subject: `We are sorry to see you go!`,
        text: `Goodbye ${name}. If you have a minute to tell us what we could have done better and why you have decided to leave our service we would be very grateful.`
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
