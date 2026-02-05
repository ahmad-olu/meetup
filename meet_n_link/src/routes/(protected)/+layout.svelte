<script lang="ts">
	import '../../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import PublicNav from './PublicNav.svelte';
	import StandardNav from './StandardNav.svelte';

	import { resolve } from '$app/paths';

	let { children, data } = $props();
	const user = $derived(data?.user ?? null);
	// console.log(data);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if user}
	<StandardNav obj={{ user }} />
{:else}
	<PublicNav />
{/if}

<main class="mt-3 mr-8 ml-8">
	{@render children()}
</main>
