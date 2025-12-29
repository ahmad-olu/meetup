<script lang="ts">
	// Target date: March 20, 2026 (example - you can change this)
	const targetDate = new Date('2026-03-20T13:41:00');

	let days = $state(0);
	let hours = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);

	function updateCountdown() {
		const now = new Date();
		const difference = targetDate.getTime() - now.getTime();

		if (difference > 0) {
			days = Math.floor(difference / (1000 * 60 * 60 * 24));
			hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
			seconds = Math.floor((difference % (1000 * 60)) / 1000);
		} else {
			days = 0;
			hours = 0;
			minutes = 0;
			seconds = 0;
		}
	}

	$effect(() => {
		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);
		return () => clearInterval(interval);
	});

	function formatNumber(num: number): string {
		return num.toString().padStart(2, '0');
	}

	const startDate = new Date('2015-12-21T11:49:00');
	const formattedStartDate = startDate.toLocaleDateString('en-US', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	});

	const formattedTargetDate = targetDate.toLocaleDateString('en-US', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	});
</script>

<div class="flex align-top">
	<div class="relative w-full overflow-hidden">
		<!-- Main countdown -->
		<div class="relative z-10 flex min-h-[calc(100vh-200px)] flex-col items-center justify-center">
			<div class="rounded-2xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-sm">
				<div class="flex gap-8">
					<!-- Days -->
					<div class="flex flex-col items-center">
						<div class="mb-2 text-8xl font-light tracking-wider">
							{formatNumber(days)}
						</div>
						<div class="text-sm tracking-widest uppercase">Days</div>
					</div>

					<!-- Hours -->
					<div class="flex flex-col items-center">
						<div class="mb-2 text-8xl font-light tracking-wider">
							{formatNumber(hours)}
						</div>
						<div class="text-sm tracking-widest uppercase">Hours</div>
					</div>

					<!-- Minutes -->
					<div class="flex flex-col items-center">
						<div class="mb-2 text-8xl font-light tracking-wider">
							{formatNumber(minutes)}
						</div>
						<div class="text-sm tracking-widest uppercase">Minutes</div>
					</div>

					<!-- Seconds -->
					<div class="flex flex-col items-center">
						<div class="mb-2 text-8xl font-light tracking-wider">
							{formatNumber(seconds)}
						</div>
						<div class="text-sm tracking-widest uppercase">Seconds</div>
					</div>
				</div>
			</div>

			<!-- Event title and date range -->
			<div class="mt-12 text-center">
				<h1 class="mb-3 text-3xl font-light tracking-widest uppercase">Winter 2015</h1>
				<p class="text-sm">
					{formattedStartDate} — {formattedTargetDate}
				</p>
			</div>
		</div>
	</div>
</div>

<style>
</style>
