import { fail } from '@sveltejs/kit';
import { db } from '$lib/db';
import { usersExtra, verificationDocuments, user } from '../../../../../drizzle/schema';
import { verificationService } from '$lib/server/queries/verification';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Check if user is admin
	if (!locals.user || locals.user.role !== 'admin') {
		throw new Error('Unauthorized');
	}

	// Get all users with pending verification
	const pendingVerifications = await db
		.select({
			user: user,
			userExtra: usersExtra
		})
		.from(usersExtra)
		.innerJoin(user, eq(usersExtra.userId, user.id))
		.where(eq(usersExtra.verificationStatus, 'pending'));

	// Get documents for each pending user
	const verificationsWithDocs = await Promise.all(
		pendingVerifications.map(async (v) => {
			const docs = await db
				.select()
				.from(verificationDocuments)
				.where(eq(verificationDocuments.userId, v.user.id));

			return {
				user: v.user,
				userExtra: v.userExtra,
				documents: docs
			};
		})
	);

	return {
		pendingVerifications: verificationsWithDocs
	};
};

export const actions: Actions = {
	approve: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const userId = formData.get('userId') as string;

		if (!userId) {
			return fail(400, { error: 'User ID required' });
		}

		try {
			await verificationService.reviewVerification({
				userId,
				reviewerId: locals.user.id,
				approved: true
			});

			return { success: true, message: 'User verified successfully' };
		} catch (error) {
			return fail(500, {
				error: error instanceof Error ? error.message : 'Verification failed'
			});
		}
	},

	reject: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const userId = formData.get('userId') as string;
		const reason = formData.get('reason') as string;

		if (!userId || !reason) {
			return fail(400, { error: 'User ID and reason required' });
		}

		try {
			await verificationService.reviewVerification({
				userId,
				reviewerId: locals.user.id,
				approved: false,
				rejectionReason: reason
			});

			return { success: true, message: 'Verification rejected' };
		} catch (error) {
			return fail(500, {
				error: error instanceof Error ? error.message : 'Rejection failed'
			});
		}
	}
};
