const nodemailer = require('nodemailer');
const ejs = require('ejs');
const htmlToText = require('html-to-text');

class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.from = `Abhinav Aggarwal <${process.env.EMAIL_FROM}>`;
	}

	_newTransport() {
		if (process.env.NODE_ENV === 'production') {
			// TODO: Sendgrid
			return;
		}

		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	async send(type, subject) {
		const html = await ejs.renderFile(`${__dirname}/../views/email.ejs`, {
			firstName: this.firstName,
			url: this.url,
			subject,
			type,
		});

		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.htmlToText(html),
		};

		await this._newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to the Natours Family!');
	}

	async sendPasswordReset() {
		await this.send('passwordReset', 'Your password reset token');
	}
}

module.exports = Email;
