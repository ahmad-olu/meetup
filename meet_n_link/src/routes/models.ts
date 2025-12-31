import { z } from 'zod';

export const eventsSearchSchema = z.object({
	// location: z.string().default('Ikeja, Lagos, Nigeria'),
	sco: z.string().default('Nigeria'), //country
	sst: z.string().default(''), //state
	sci: z.string().default('') //city
});

export type UpComingEvent = {
	id: string;
	createdAt: Date | null;
	country: string;
	stateProvince: string | null;
	city: string | null;
	fullLocation: string | null;
	events: {
		id: string;
		createdAt: Date | null;
		updatedAt: Date | null;
		status: 'approved' | 'proposed' | 'cancelled' | 'completed' | null;
		description: string;
		title: string;
		locationId: string | null;
		categoryId: string | null;
		creatorId: string | null;
		proposedDate: string;
		dayOfWeek: 'wednesday' | 'saturday';
		startTime: string | null;
		endTime: string | null;
		minVotesRequired: number | null;
		currentVotes: number | null;
		votingDeadline: Date;
		requiresFunding: boolean | null;
		fundingGoal: number | null;
		currentFunding: number | null;
		venueDetails: string | null;
	}[];
}[];

export function getClosestApprovedDate(data: UpComingEvent): string | null {
	const now = Date.now();

	const approvedDates = data
		.flatMap((item) => item.events)
		.filter((event) => event.status === 'approved')
		.map((event) => new Date(event.proposedDate))
		.filter((date) => !isNaN(date.getTime()) && date.getTime() >= now);

	if (approvedDates.length === 0) return null;

	const closest = approvedDates.reduce((a, b) => (a.getTime() < b.getTime() ? a : b));

	return closest.toISOString();
}

export function getClosestApprovedDate2(data: UpComingEvent): string | null {
	const now = Date.now();
	let closest: Date | null = null;

	for (const item of data) {
		for (const event of item.events) {
			if (event.status !== 'approved') continue;

			const date = new Date(event.proposedDate);
			if (isNaN(date.getTime()) || date.getTime() < now) continue;

			if (!closest || date < closest) {
				closest = date;
			}
		}
	}

	return closest ? closest.toISOString() : null;
}
