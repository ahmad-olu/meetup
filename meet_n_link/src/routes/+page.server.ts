import { readFileSync } from 'fs';
import { join } from 'path';
import { validateSearchParams } from 'runed/kit';
import { eventsSearchSchema } from './models';
import { error } from '@sveltejs/kit';
import { db } from '$lib/db.js';
import { and, ilike, eq, count, sql, asc } from 'drizzle-orm';
import { eventCategories, locations } from '../../drizzle/schema';
import type { UpComingEvent } from './models';
import { getClosestApprovedDate } from './models.js';

interface Country {
	id: number;
	name: string;
	iso3: string;
	iso2: string;
	phone_code: string;
	capital: string;
	currency: string;
	currency_symbol: string;
	tld: string;
	native: string;
	region: string;
	subregion: string;
	timezones: {
		zoneName: string;
		gmtOffset: number;
		gmtOffsetName: string;
		abbreviation: string;
		tzName: string;
	}[];
	translations: {
		kr: string;
		br: string;
		pt: string;
		nl: string;
		hr: string;
		fa: string;
		de: string;
		es: string;
		fr: string;
		ja: string;
		it: string;
		cn: string;
	};
	latitude: string;
	longitude: string;
	emoji: string;
	emojiU: string;
}

export const load = async ({ url }) => {
	const filePath = join(process.cwd(), 'static', 'countries.json');
	const fileContent = readFileSync(filePath, 'utf-8');
	const countries: Country[] = JSON.parse(fileContent);

	const { searchParams } = validateSearchParams(url, eventsSearchSchema);

	const sco = searchParams.get('sco');
	const sst = searchParams.get('sst');

	let states: string[] = [];
	let events: UpComingEvent = [];
	let closestDate: string | null = null;

	if (typeof sco === 'string' && sco.trim().length > 0) {
		const res = await db.query.locations.findMany({
			where: { country: sco },
			columns: {
				stateProvince: true
			},
			orderBy: { city: 'asc' }
		});

		states = [
			...new Set([
				...states,
				...res
					.filter((r) => r !== null)
					.map((r) => r.stateProvince!)
					.filter(Boolean)
			])
		];
	}
	if (typeof sst === 'string' && sst.trim().length > 0) {
		const res = await db.query.locations.findMany({
			where: {
				country: sco!.trim(),
				stateProvince: sst!.trim()
			},
			with: {
				events: {
					where: {
						proposedDate: {
							gte: new Date().toISOString()
						},
						// status: 'approved'
						status: { OR: ['approved', 'proposed'] }
					},
					orderBy: { proposedDate: 'asc' }
				}
			}
		});
		events = res;
		closestDate = getClosestApprovedDate(res);
	}

	// return {
	// 	countries
	// };
	return {
		countries: countries.map((e) => e.name),
		states,
		events,
		closestDate
	};
};
