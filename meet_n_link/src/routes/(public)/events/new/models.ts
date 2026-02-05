import { z } from 'zod';

export const newProposeEventSchema = z.object({
	// location: z.string().default('Ikeja, Lagos, Nigeria'),
	sco: z.string().default('Nigeria'), //country
	sst: z.string().default(''), //state
	sci: z.string().default(''), //city
	scur: z.string().default('NGN'), //currency
	scat: z.string().default('Programming')
});
