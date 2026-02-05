import { readFileSync } from 'fs';
import { join } from 'path';
import { validateSearchParams } from 'runed/kit';
import { newProposeEventSchema } from './models';
import { error } from '@sveltejs/kit';
import { db } from '$lib/db.js';
import { and, ilike, eq, count, sql, asc } from 'drizzle-orm';

import { locations, eventCategories } from '../../../../../drizzle/schema.js';

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

export const load = async ({ url, fetch, locals }) => {
	if (!locals.user) {
		error(401, 'Unauthorized');
	}
	// Read from static folder
	const filePath = join(process.cwd(), 'static', 'countries.json');
	const fileContent = readFileSync(filePath, 'utf-8');
	const countries: Country[] = JSON.parse(fileContent);

	const { data } = validateSearchParams(url, newProposeEventSchema);

	const sco = data.sco;
	const sst = data.sst;
	const sci = data.sci;
	const scat = data.scat;
	const scur = data.scur;

	const selectedCurrency = countries.find((r) => r.currency === scur) ?? {
		currency: 'USD',
		currency_symbol: '₦'
	};

	let states: string[] = [];
	let cities: string[] = [];
	let locationId: string | null = null;
	let categories: string[] = [];
	let categoriesId: string | null = null;
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
		const res = await db
			.select({ city: locations.city })
			.from(locations)
			.where(and(eq(locations.country, sco!.trim()), eq(locations.stateProvince, sst!.trim())));

		cities = [
			...new Set([
				...cities,
				...res
					.filter((r) => r !== null)
					.map((r) => r.city!)
					.filter(Boolean)
			])
		];
	}
	if (typeof sci === 'string' && sci.trim().length > 0) {
		const [res] = await db
			.select({
				id: locations.id
				//	 fullLocation: locations.fullLocation
			})
			.from(locations)
			.where(
				and(
					eq(locations.country, sco!.trim()),
					eq(locations.stateProvince, sst!.trim()),
					eq(locations.city, sci!.trim())
				)
			)
			.limit(1);
		locationId = res?.id ?? null;
	}

	if (categories) {
		const res = await db
			.select({
				name: eventCategories.name
			})
			.from(eventCategories);
		categories = [
			...new Set([
				...categories,
				...res
					.filter((r) => r !== null)
					.map((r) => r.name)
					.filter(Boolean)
			])
		];
	}
	if (scat) {
		const [res] = await db
			.select({
				id: eventCategories.id
			})
			.from(eventCategories)
			.where(eq(eventCategories.name, scat!.trim()))
			.limit(1);
		categoriesId = res?.id ?? null;
	}

	// return {
	// 	countries
	// };
	return {
		countries: countries.map((e) => e.name),
		states,
		cities,
		locationId: locationId,
		categories,
		categoriesId: categoriesId,
		currencies: countries.map((e) => ({
			id: e.id,
			currency_symbol: e.currency_symbol,
			currency: e.currency,
			emoji: e.emoji
		})),
		selectedCurrency: {
			currency: selectedCurrency.currency,
			currency_symbol: selectedCurrency.currency_symbol
		}
	};
};
