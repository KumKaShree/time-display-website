<script lang="ts">
	import { currentTheme, themeConfigs } from '$lib/stores/themeStore';
	import { Home, Timer } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	$: themeConfig = themeConfigs[$currentTheme];

	let timeWasted = 0;
	const STORAGE_KEY = '404_time_wasted';

	// Expanded fun facts about time
	const timeFacts = [
		"Did you know? The time you've spent here could've been used to microwave a burrito.",
		"Fun fact: Light could travel around Earth 7.5 times in just one second. This page? Nowhere to be found.",
		"Meanwhile, somewhere in the multiverse, this page probably exists.",
		"Plot twist: This page is just taking a coffee break.",
		"Error 404: Page got lost in a temporal vortex.",
		"Time flies when you're looking for pages that don't exist.",
		"In the time you've spent here, approximately 100 million cells in your body have been replaced.",
		"This page exists in theory, just not in practice.",
		"Quantum physics suggests this page might exist and not exist at the same time.",
		"If you wait long enough, due to quantum tunneling, this page might spontaneously appear.",
		"Time is relative. This page's existence is not.",
		"404 seconds of your life you'll never get back... but who's counting? (We are)",
		"This page has mastered the art of social distancing.",
		"The page you're looking for is currently exploring the space-time continuum.",
		"Even with infinite monkeys typing for infinite time, this page would still be 404.",
		"The page took a quantum leap into another dimension.",
		"Error 404: Page caught in a time paradox.",
		"This page is currently attending a parallel universe convention.",
		"The page exists in a superposition of 'found' and 'not found'.",
		"Schrödinger's webpage: simultaneously here and not here."
	];

	
	let randomFact = timeFacts[Math.floor(Math.random() * timeFacts.length)];

	onMount(() => {
		const storedTime = localStorage.getItem(STORAGE_KEY);
		timeWasted = storedTime ? parseInt(storedTime, 10) : 0;

		const interval = setInterval(() => {
			timeWasted++;
			localStorage.setItem(STORAGE_KEY, timeWasted.toString());

			// Change fact every 8 seconds
			if (timeWasted % 8 === 0) {
				randomFact = timeFacts[Math.floor(Math.random() * timeFacts.length)];
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	function resetTime() {
		timeWasted = 0;
		localStorage.setItem(STORAGE_KEY, '0');
	}

	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return [
			hours > 0 ? `${hours}h` : null,
				minutes > 0 ? `${minutes}m` : null,
				`${secs}s`
		].filter(Boolean).join(' ');
	}

	// Enhanced time-based messages
	$: timeMessage = 
		timeWasted < 3 ? "Just arrived? That was quick!" :
		timeWasted < 8 ? "Still here? The void is quite comfy..." :
		timeWasted < 15 ? "You must really like this error page!" :
		timeWasted < 30 ? "Achievement Unlocked: Professional Time Waster" :
		timeWasted < 60 ? "You could have made instant noodles in this time" :
		timeWasted < 120 ? "Two minutes? You're really committed to this page!" :
		timeWasted < 300 ? "You're officially a temporal anomaly expert!" :
		timeWasted < 600 ? "Legend says if you stay here long enough, the page might appear..." :
		"You've achieved zen-like patience with this 404 page";
</script>

<div 
	class="min-h-screen flex items-center justify-center p-4 {themeConfig.background} {themeConfig.text}"
	in:fade={{ duration: 300 }}
>
	<div class="w-full max-w-lg flex flex-col">
		<!-- Error Card -->
		<div 
			class="card p-8 {themeConfig.accent} backdrop-blur-lg rounded-2xl border border-white/10"
			in:fade={{ duration: 300, delay: 150 }}
		>
			<!-- Header -->
			<header class="mb-8">
				<div class="flex items-center justify-between mb-4">
					<h1 class="text-7xl font-semibold tracking-wide">404</h1>
					<button 
						class="opacity-50 hover:opacity-100 transition-opacity"
						on:click={resetTime}
						title="Reset time counter"
					>
						<Timer class="w-8 h-8 animate-spin-slow hover:animate-none" />
					</button>
				</div>
				<h2 class="text-xl font-light mb-2">Oops! Page Not Found</h2>
				<p class="opacity-70 text-sm">
					The page has achieved quantum tunneling and escaped our servers.
				</p>
			</header>

			<!-- Time Counter with Message -->
			<div class="space-y-4 mb-8">
				<div class="card variant-soft p-4 rounded-xl bg-black/20">
					<div class="flex justify-between items-center text-sm">
						<span class="opacity-70">Time-space distortion</span>
						<code class="font-mono bg-black/20 px-2 py-1 rounded-md">{formatTime(timeWasted)}</code>
					</div>
				</div>
				
				<!-- Dynamic Message -->
				<div class="text-sm text-center opacity-70 italic">
					{timeMessage}
				</div>
			</div>

			<!-- Action Button -->
			<div class="flex justify-center">
				<a 
					href="/"
					class="btn variant-filled-primary flex items-center gap-2 px-6 py-2.5"
				>
					<Home class="w-4 h-4" />
					<span>Return to Reality</span>
				</a>
			</div>
		</div>

		<!-- Fun Fact with fixed height -->
		<div 
			class="h-[60px] mt-4 flex items-center justify-center"
			in:fade={{ duration: 300, delay: 300 }}
		>
			<div class="text-sm text-center opacity-60 backdrop-blur-sm rounded-lg p-4 border border-white/5 w-full">
				<p class="line-clamp-2">
					{randomFact}
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	:global(.card) {
		box-shadow: 
			0 8px 32px rgba(0, 0, 0, 0.2),
			0 2px 8px rgba(0, 0, 0, 0.1);
	}

	:global(.btn) {
		border-radius: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.025em;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	:global(.btn:hover) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	@keyframes spin-slow {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.animate-spin-slow {
		animation: spin-slow 8s linear infinite;
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
