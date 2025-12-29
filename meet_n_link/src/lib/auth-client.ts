import { createAuthClient } from 'better-auth/svelte';
import { adminClient, organizationClient } from 'better-auth/client/plugins';

//import { PUBLIC_AUTH_SERVER_URL } from '$env/static/public';

export const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	//	baseURL: PUBLIC_AUTH_SERVER_URL
	plugins: [organizationClient(), adminClient()]
});

// export const authServer = betterAuth({
// 	baseURL: PUBLIC_AUTH_SERVER_URL
// });
