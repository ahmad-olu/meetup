import { betterAuth, logger } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, createAuthMiddleware } from 'better-auth/plugins';
import { db } from './db'; // your drizzle instance
import * as schema from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { organization } from 'better-auth/plugins';
import { sendEmail } from './utils/email';

export const auth = betterAuth({
	trustedOrigins: ['*'],
	appName: 'meet_n_link',
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: schema
	}),
	plugins: [
		// oneTimeToken({
		// 	expiresIn: 1
		// }),
		organization({
			organizationHooks: {},
			organizationCreation: {},
			requireEmailVerificationOnInvitation: true
		}),
		admin()
	],
	session: {},
	user: {
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async ({ user, url, token, newEmail }) => {
				try {
					console.log(url);
					await sendEmail({
						to: user.email,
						subject: 'metrov email change',
						text: `approve email change: your email as been changed to ${newEmail} click to approve url :${url}`,
						html: `<a href="${url}">Click here to approve email change: your email as been changed to ${newEmail}</a>` // Fix: add href
					});
					console.log('✅ Email sent successfully [sendChangeEmailVerification]');
				} catch (error) {
					console.error('❌ Email send failed:', error);
					logger.error(' Failed to send verification email:', error);
					throw error;
				}
			}
		},

		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url, token }) => {
				try {
					console.log(url);

					await sendEmail({
						to: user.email,
						subject: 'metrov delete user verification',
						text: `verification url :${url}`,
						html: `<a href="${url}">Click here to verify new email address</a>` // Fix: add href
					});
					console.log('✅ Email sent successfully [sendDeleteAccountVerification]');
				} catch (error) {
					console.error('❌ Email send failed:', error);
					logger.error(' Failed to send verification email:', error);
					throw error;
				}
			}
		},

		socialProviders: {
			// github: {
			//   clientId: process.env.GITHUB_CLIENT_ID as string,
			//   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			// },
			// google:{}
		}
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: true,
		resetPasswordTokenExpiresIn: 3600
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url, token }) => {
			try {
				console.log('Verify Token: ', url);
				await sendEmail({
					to: user.email,
					subject: 'metrov email verification',
					text: `verification url :${url}`,
					html: `<a href="${url}">Click here to verify: ${url}</a>` // Fix: add href
				});
				console.log('✅ Email sent successfully [sendVerificationEmail]');
			} catch (error) {
				console.error('❌ Email send failed:', error);
				logger.error(' Failed to send verification email:', error);
				throw error;
			}
		}
	},
	rateLimit: {
		window: 100,
		max: 1,
		enabled: true,
		modelName: 'rate_limit'
		// customRules: {
		// 	'/sign-in/email': {
		// 		window: 10,
		// 		max: 3
		// 	}
		// }
	},
	hooks: {
		after: createAuthMiddleware(async (ctx) => {}),
		before: createAuthMiddleware(async (ctx) => {})
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user, ctx) => {
					if (!ctx || !ctx.context || !ctx.context.adapter) {
						return;
					}
					const count = await ctx.context.adapter.count({
						model: 'user'
					});
					if (count <= 1) {
						await db.update(schema.user).set({ role: 'admin' }).where(eq(schema.user.id, user.id));
					}
					return;
				}
			}
		}
	}
});
