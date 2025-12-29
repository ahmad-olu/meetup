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

	let { children, data } = $props();

	// console.log(data);

	type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
		title: string;
		href: string;
		content: string;
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#snippet ListItem({ title, content, href, class: className, ...restProps }: ListItemProps)}
	<li>
		<NavigationMenu.Link>
			{#snippet child()}
				<a
					{href}
					class={cn(
						'block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
						className
					)}
					{...restProps}
				>
					<div class="text-sm leading-none font-medium">{title}</div>
					<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{content}
					</p>
				</a>
			{/snippet}
		</NavigationMenu.Link>
	</li>
{/snippet}

<div class="mb- mt-5 flex justify-center">
	<NavigationMenu.Root>
		<!-- <NavigationMenu.Root viewport={isMobile.current}> -->
		<NavigationMenu.List class="flex-wrap">
			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<a href="/" class={navigationMenuTriggerStyle()}>Home</a>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<!-- <NavigationMenu.Item class="hidden md:block">
				<NavigationMenu.Trigger>List</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<ul class="grid w-[300px] gap-4 p-2">
						<li>
							<NavigationMenu.Link href="##">
								<div class="font-medium">Components</div>
								<div class="text-muted-foreground">Browse all components in the library.</div>
							</NavigationMenu.Link>
							<NavigationMenu.Link href="##">
								<div class="font-medium">Documentation</div>
								<div class="text-muted-foreground">Learn how to use the library.</div>
							</NavigationMenu.Link>
							<NavigationMenu.Link href="##">
								<div class="font-medium">Blog</div>
								<div class="text-muted-foreground">Read our latest blog posts.</div>
							</NavigationMenu.Link>
						</li>
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item> -->
			<!-- <NavigationMenu.Item class="hidden md:block">
				<NavigationMenu.Trigger>Simple</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<ul class="grid w-[200px] gap-4 p-2">
						<li>
							<NavigationMenu.Link href="##">Components</NavigationMenu.Link>
							<NavigationMenu.Link href="##">Documentation</NavigationMenu.Link>
							<NavigationMenu.Link href="##">Blocks</NavigationMenu.Link>
						</li>
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item> -->
			<NavigationMenu.Item>
				<NavigationMenu.Trigger>Help</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<ul class="grid gap-2 p-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
						{@render ListItem({
							href: '/about',
							title: 'About',
							content: ''
						})}
						{@render ListItem({
							href: '/faq',
							title: 'Frequesntly asked Questions',
							content: ''
						})}
						{@render ListItem({
							href: '/privacy-policy',
							title: 'Privacy Policy',
							content: ''
						})}
						{@render ListItem({
							href: '/terms-and-condition',
							title: 'Terms and Condition',
							content: ''
						})}
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
			<NavigationMenu.Item>
				{#if data.user}
					<AlertDialog.Root>
						<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
							Sign out
						</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
								<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
								<form action="">
									<Button type="submit">Continue</Button>
								</form>
								<!-- <AlertDialog.Action>Continue</AlertDialog.Action> -->
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				{:else}
					<NavigationMenu.Link href={resolve('/(public)/signin')}>Sign in</NavigationMenu.Link>
				{/if}
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
</div>

<main class="mt-3 mr-8 ml-8">
	{@render children()}
</main>
