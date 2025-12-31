<script lang="ts">
	import '../../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { cn } from '$lib/utils.js';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	import { resolve } from '$app/paths';
	import StandardNav from '../(protected)/StandardNav.svelte';
	import PublicNav from '../(protected)/PublicNav.svelte';

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
