<script lang="ts">
	import '../../app.css';
	import { resolve } from '$app/paths';

	let helpOpen = false;
</script>

<header class="border-b border-slate-200 bg-white">
	<div class="mx-auto max-w-7xl px-4">
		<nav class="flex h-14 items-center justify-between text-sm text-slate-700">
			<div class="flex items-center gap-4">
				<a href={resolve('/')} class="rounded-md px-2 py-1 hover:bg-slate-100"> Home </a>

				<a href={resolve('/(public)/how-it-works')} class="rounded-md px-2 py-1 hover:bg-slate-100">
					How it works
				</a>

				<div class="relative">
					<button
						type="button"
						class="rounded-md px-2 py-1 hover:bg-slate-100"
						onclick={() => (helpOpen = !helpOpen)}
					>
						Help
					</button>

					{#if helpOpen}
						<div class="absolute left-0 mt-1 w-64 rounded-md border border-slate-200 bg-white">
							<div class="px-3 py-2 text-xs font-medium text-slate-400 uppercase">Support</div>
							<a href="/faq" class="block px-3 py-2 hover:bg-slate-50">
								Frequently asked questions
							</a>
							<a href="/privacy-policy" class="block px-3 py-2 hover:bg-slate-50">
								Privacy policy
							</a>
							<a href="/terms-and-condition" class="block px-3 py-2 hover:bg-slate-50">
								Terms and conditions
							</a>
						</div>
					{/if}
				</div>
			</div>

			<div class="flex items-center gap-3">
				<a href={resolve('/(public)/signin')} class="rounded-md px-2 py-1 hover:bg-slate-100">
					Sign in
				</a>
				<a
					href={resolve('/(public)/signup')}
					class="rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-50"
				>
					Sign up
				</a>
			</div>
		</nav>
	</div>
</header>
