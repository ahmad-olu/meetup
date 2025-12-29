import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

const betterAuthHandle: Handle = async function handle({ event, resolve }) {
	return svelteKitHandler({ event, resolve, auth, building });
};

const logHandle: Handle = async ({ event, resolve }) => {
	console.log(`path => ${event.url}`);
	const response = await resolve(event);
	return response;
};

const sessionHandle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});
	event.locals.user = session?.user;

	const response = await resolve(event);
	return response;
};

// import { redirect } from '@sveltejs/kit';
// import { authClient } from '$lib/auth-client';

// const PUBLIC_ROUTES = ['/sign-in', '/sign-up', '/forgot-password'];

// const authentication: Handle = async ({ event, resolve }) => {
// 	const isPublic = PUBLIC_ROUTES.some((path) => event.url.pathname.startsWith(path));

// 	try {
// 		const session = await authClient.getSession(event);
// 		console.log(JSON.stringify(session));

// 		if (!session && !isPublic) {
// 			throw redirect(303, '/sign-in');
// 		}

// 		// if (session && isPublic) {
// 		//   throw redirect(303, '/');
// 		// }
// 	} catch (_err) {
// 		if (!isPublic) {
// 			throw redirect(303, '/sign-in');
// 		}
// 	}

// 	return resolve(event);
// };

export const handle = sequence(betterAuthHandle, logHandle, sessionHandle);
