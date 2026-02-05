import { db } from '../../db';
import { usersExtra, verificationDocuments } from '../../../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import type { User } from '../../../../drizzle/schema';

export interface SubmitVerificationParams {
	userId: string;
	documents: {
		type: 'government_id' | 'address_proof' | 'selfie';
		url: string;
	}[];
}

export interface ReviewVerificationParams {
	userId: string;
	reviewerId: string;
	approved: boolean;
	rejectionReason?: string;
}

export class VerificationService {
	/**
	 * Submit verification documents
	 */
	async submitVerification({ userId, documents }: SubmitVerificationParams) {
		return await db.transaction(async (tx) => {
			// Update user verification status
			await tx
				.update(usersExtra)
				.set({
					verificationStatus: 'pending',
					verificationSubmittedAt: new Date()
				})
				.where(eq(usersExtra.userId, userId));

			// Insert documents
			const insertedDocs = await tx
				.insert(verificationDocuments)
				.values(
					documents.map((doc) => ({
						userId,
						documentType: doc.type,
						documentUrl: doc.url,
						status: 'pending' as const
					}))
				)
				.returning();

			return insertedDocs;
		});
	}

	/**
	 * Review verification documents
	 */
	async reviewVerification({
		userId,
		reviewerId,
		approved,
		rejectionReason
	}: ReviewVerificationParams) {
		return await db.transaction(async (tx) => {
			const newStatus = approved ? 'approved' : 'rejected';

			// Update all pending documents for this user
			await tx
				.update(verificationDocuments)
				.set({
					status: newStatus,
					reviewedAt: new Date(),
					reviewedBy: reviewerId,
					rejectionReason: approved ? null : rejectionReason
				})
				.where(
					and(eq(verificationDocuments.userId, userId), eq(verificationDocuments.status, 'pending'))
				);

			// Update user verification status
			await tx
				.update(usersExtra)
				.set({
					verificationStatus: newStatus,
					isVerified: approved
				})
				.where(eq(usersExtra.userId, userId));

			return { success: true, status: newStatus };
		});
	}

	/**
	 * Get verification status for a user
	 */
	async getVerificationStatus(userId: string) {
		const [userExtra] = await db
			.select()
			.from(usersExtra)
			.where(eq(usersExtra.userId, userId))
			.limit(1);

		const documents = await db
			.select()
			.from(verificationDocuments)
			.where(eq(verificationDocuments.userId, userId))
			.orderBy(verificationDocuments.submittedAt);

		return {
			userExtra,
			documents
		};
	}

	/**
	 * Get all pending verifications for admin review
	 */
	async getPendingVerifications() {
		return await db
			.select()
			.from(usersExtra)
			.where(eq(usersExtra.verificationStatus, 'pending'))
			.orderBy(usersExtra.verificationSubmittedAt);
	}
}

export const verificationService = new VerificationService();
