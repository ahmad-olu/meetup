import { logger } from 'better-auth';
import { log } from 'console';

import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

async function createTransporter() {
	if (process.env.NODE_ENV === 'test') {
		return null;
	}
	// const testAccount = await nodemailer.createTestAccount();
	return nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT) || 587,
		secure: process.env.SMTP_SECURE === 'true',
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD
			// user: testAccount.user,
			// pass: testAccount.pass,
		}
		// logger: true,
		// debug: true,
	} as SMTPTransport.Options);
}

export type EmailOptions = {
	to: string;
	subject: string;
	html: string;
	text?: string;
};

export async function sendEmail(options: EmailOptions): Promise<void> {
	const transporter = await createTransporter();
	const fromEmail = process.env.FROM_EMAIL || 'noreply@example.com';
	if (!transporter) {
		logger.info(`[${process.env.NODE_ENV}] Skipping actual email sending.`);
		return;
	}

	try {
		const info = await transporter.sendMail({
			from: `"" <${fromEmail}>`,
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text
		});

		if (process.env.NODE_ENV === 'development') {
			if (info.messageId && process.env.SMTP_HOST === 'smtp.ethereal.email') {
				logger.info('preview URL: ', nodemailer.getTestMessageUrl(info));
			} else if (
				info.messageId &&
				process.env.SMTP_HOST === '127.0.0.1' &&
				process.env.SMTP_SERVICE === 'Mailpit'
			) {
				const match = info.response.match(/queued as (\S+)/);
				if (match) {
					const queueId = match[1];
					logger.info(`preview URL: http://localhost:8025/view/${queueId}`);
				}
			}
		} else if (process.env.NODE_ENV === 'test') {
			logger.info('[TEST] Email sent successfully (mock)');
			logger.info('[TEST] Message ID: ', info.messageId);
		}
	} catch (error) {
		logger.error('Failed to send email:', error);
		throw error;
	}
}

export async function sendVerificationEmail(
	to: string,
	url: string,
	_token: string
): Promise<void> {
	const subject = 'Verify your email address';

	const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <h2 style="color: #2d89ef;">Welcome to Metro v!</h2>
    <p>Thank you for signing up! Please click the button below to verify your email address:</p>

    <p style="text-align: center; margin: 30px 0;">
      <a href="${url}"
         style="background-color: #2d89ef; color: #fff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
         Verify Email Address
      </a>
    </p>

    <p>If the button doesn’t work, you can copy and paste the link below into your browser:</p>
    <p style="word-break: break-all; color: #2d89ef;">${url}</p>

    <p><strong>Note:</strong> This verification link will expire in <b>1 hour</b>.</p>

    <br/>
    <p style="font-size: 0.9em; color: #777;">If you didn’t create an account, you can safely ignore this email.</p>
  </div>
`;

	const text = `
        Welcome to our app!

        Thank you for signing up! please click the link below to verify your email address:

        ${url}

        This verification link will expire in 1 hour.

        If you did'nt create an account, you can safely ignore this email.
`;

	await sendEmail({
		to,
		subject,
		html,
		text
	});
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
	const subject = 'Your Metro v Verification Code';

	const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <h2 style="color: #2d89ef; text-align: center;">Welcome to Metro v!</h2>
    <p style="text-align: center;">Use the verification code below to complete your sign up:</p>

    <div style="text-align: center; margin: 30px 0;">
      <span style="display: inline-block; font-size: 28px; letter-spacing: 4px; font-weight: bold; background: #f4f4f4; padding: 12px 24px; border-radius: 8px; border: 1px solid #ddd;">
        ${otp}
      </span>
    </div>

    <p style="text-align: center;">This code will expire in <b>10 minutes</b>.</p>

    <br/>
    <p style="font-size: 0.9em; color: #777; text-align: center;">If you didn’t create an account, you can safely ignore this email.</p>
  </div>
`;

	const text = `
        Welcome to Metro v!

        Use the verification code below to complete your sign up:

        ${otp}

        This code will expire in 10 minutes.

        If you didn’t create an account, you can safely ignore this email.
        `;

	await sendEmail({
		to,
		subject,
		html,
		text
	});
}

export async function sendOrganizationInvitation(data: {
	role: string;
	email: string;
	organizationName: string;
	invitedByUsername: string;
	invitedByEmail: string;
	invitationLInk: string;
}): Promise<void> {
	const subject = `You're invited to join ${data.organizationName} on Metro v!`;

	const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <h2 style="color: #2d89ef; text-align: center;">You're Invited!</h2>

    <p style="text-align: center;">
      <b>${data.invitedByUsername}</b> (${data.invitedByEmail}) has invited you
      to join <b>${data.organizationName}</b> as a <b>${data.role}</b>.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.invitationLInk}"
         style="display: inline-block; background: #2d89ef; color: white; text-decoration: none;
                font-size: 16px; padding: 12px 24px; border-radius: 8px; font-weight: bold;">
        Accept Invitation
      </a>
    </div>

    <p style="text-align: center; font-size: 0.95em;">
      If you don’t want to join, you can safely ignore this email.
    </p>

    <br/>
    <p style="font-size: 0.9em; color: #777; text-align: center;">
      This invitation was sent by ${data.invitedByUsername} via Metro v.
    </p>
  </div>
`;

	const text = `
You have been invited to join ${data.organizationName} on Metro v!

Invited by: ${data.invitedByUsername} (${data.invitedByEmail})
Role: ${data.role}

Accept your invitation here:
${data.invitationLInk}

If you don’t want to join, you can safely ignore this email.
`;

	await sendEmail({
		to: data.email,
		subject,
		html,
		text
	});
}
