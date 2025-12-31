import { auth } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

// export const ssr = false;

const PUBLIC_ROUTES = [
	'/signin',
	'/signup',
	'/forgot-password',
	'/about',
	'/faq',
	'/privacy-policy',
	'/terms-and-condition',
	'/how-it-works'
];

export const load = async ({ locals, url }) => {
	const isPublic =
		url.pathname === '/' || PUBLIC_ROUTES.some((path) => url.pathname.startsWith(path));

	if (!locals.user && !isPublic) {
		throw redirect(307, resolve('/signin'));
	}

	return { user: locals.user };
};
