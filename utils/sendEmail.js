const nodemailer = require('nodemailer');

const sendEmail = async options => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: 'Abhinav Aggarwal <abhiagg@aggeek.io>',
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	await transporter.sendMail(mailOptions);
	console.log('sent mail');
};

module.exports = sendEmail;
