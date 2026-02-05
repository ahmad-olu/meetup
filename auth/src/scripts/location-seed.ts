import countries from "./data/countries.json";

import { db } from "../db";
import { locations } from "../db/schema";
const BATCH_SIZE = 1000;

async function seedLocations() {
  const rows: Array<{
    country: string;
    stateProvince: string;
    city: string;
    fullLocation: string;
  }> = [];

  for (const country of countries) {
    const countryName = country.name;
    if (!country.states) continue;

    for (const state of country.states) {
      const stateName = state.name;
      if (!state.cities) continue;

      for (const city of state.cities) {
        const cityName = city.name;

        rows.push({
          country: countryName,
          stateProvince: stateName,
          city: cityName,
          fullLocation: `${cityName}, ${stateName}, ${countryName}`,
        });

        // Insert batch if reached BATCH_SIZE
        if (rows.length >= BATCH_SIZE) {
          await db.insert(locations).values(rows).onConflictDoNothing();
          rows.length = 0; // clear the array
        }
      }
    }
  }

  // Insert any remaining rows
  if (rows.length > 0) {
    await db.insert(locations).values(rows).onConflictDoNothing();
  }

  console.log("Seed complete!");
}

seedLocations().catch(console.error);
