import { readFileSync } from 'fs';
import { join } from 'path';

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

export async function load() {
	// Read from static folder
	const filePath = join(process.cwd(), 'static', 'countries.json');
	const fileContent = readFileSync(filePath, 'utf-8');
	const countries: Country[] = JSON.parse(fileContent);

	// return {
	// 	countries
	// };
	return { countries: countries.map((e) => e.name) };
}
