const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 1025,
    ignoreTLS: true
});

/**
 * Envoie un e-mail générique
 * @param {Object} options - Les options d'envoi
 * @param {string} options.to - Destinataire
 * @param {string} options.subject - Sujet
 * @param {string} options.html - Contenu HTML
 */
const sendEmail = async ({ to, subject, html }) => {
    const mailOptions = {
        from: '"Support" <no-reply@example.com>',
        to,
        subject,
        html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
