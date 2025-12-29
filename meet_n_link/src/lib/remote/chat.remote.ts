import { form, getRequestEvent, query } from '$app/server';
import { db } from '$lib/db';
import { error } from '@sveltejs/kit';
import { and, ilike, eq, count, sql } from 'drizzle-orm';
import * as z from 'zod';
import { eventOrganizers, events, locations } from '../../../drizzle/schema';
