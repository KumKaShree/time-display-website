<script lang="ts">
	import { currentTheme, type Theme, themeConfigs } from '$lib/stores/themeStore';
	import { is24Hour, showCountdown, timeStore } from '$lib/stores/timeStore';
	import gsap from 'gsap';
	import { Clock4, Palette, Timer, Clock12, PaintBucket, TimerOff } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import TimeInfo from './TimeInfo.svelte';

	$: themeConfig = themeConfigs[$currentTheme];

	$: hours = $timeStore?.hours ?? 0;
	$: minutes = $timeStore?.minutes ?? 0;
	$: seconds = $timeStore?.seconds ?? 0;

	$: displayHours = $is24Hour ? hours : hours % 12 || 12;
	$: ampm = hours >= 12 ? 'PM' : 'AM';

	$: formattedHours = displayHours.toString().padStart(2, '0');
	$: formattedMinutes = minutes.toString().padStart(2, '0');
	$: formattedSeconds = seconds.toString().padStart(2, '0');

	let timeElement: HTMLDivElement;
	let secondsElement: HTMLSpanElement;
	let hoursElement: HTMLSpanElement;
	let minutesElement: HTMLSpanElement;
	let prevSeconds = seconds;
	let prevMinutes = minutes;
	let prevHours = hours;

	// Add state for controls visibility
	let showControls = false;
	let controlsTimeout: NodeJS.Timeout;

	let isDockHovered = false;

	function showControlsTemporarily(e?: Event) {
		if (!isDockHovered) {
			showControls = true;
			clearTimeout(controlsTimeout);
			controlsTimeout = setTimeout(() => {
				showControls = false;
			}, 3000);
		}
	}

	function handleDockMouseEnter() {
		isDockHovered = true;
		showControls = true;
		clearTimeout(controlsTimeout);
	}

	function handleDockMouseLeave() {
		isDockHovered = false;
		showControlsTemporarily();
	}

	// Enhanced animations
	onMount(() => {
		showControlsTemporarily();
		return () => clearTimeout(controlsTimeout);
	});

	// Enhanced number transitions for all units
	$: if (secondsElement && seconds !== prevSeconds) {
		const direction = seconds === 0 ? -1 : 1;
		gsap.fromTo(
			secondsElement,
			{
				y: direction * 20,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.4,
				ease: 'power2.out'
			}
		);
		prevSeconds = seconds;
	}

	// Enhanced minute transition
	$: if (minutesElement && minutes !== prevMinutes) {
		const direction = minutes === 0 ? -1 : 1;
		gsap.fromTo(
			minutesElement,
			{
				y: direction * 20,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.4,
				ease: 'power2.out'
			}
		);
		prevMinutes = minutes;
	}

	// Enhanced hour transition
	$: if (hoursElement && hours !== prevHours) {
		const direction = hours === 0 ? -1 : 1;
		gsap.fromTo(
			hoursElement,
			{
				y: direction * 20,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.4,
				ease: 'power2.out'
			}
		);
		prevHours = hours;
	}

	function cycleTheme(direction: number = 1) {
		const themes: Theme[] = Object.keys(themeConfigs) as Theme[];
		currentTheme.update((current) => {
			const currentIndex = themes.indexOf(current);
			const newIndex = (currentIndex + direction + themes.length) % themes.length;
			return themes[newIndex];
		});
	}

	function toggleTimeFormat() {
		is24Hour.update((value) => !value);
	}

	// Show controls on first mount
	onMount(() => {
		showControlsTemporarily();
		return () => clearTimeout(controlsTimeout);
	});

	// Add countdown formatting
	$: countdown = $timeStore?.countdown;
	$: formattedCountdownDays = countdown?.days.toString().padStart(2, '0');
	$: formattedCountdownHours = countdown?.hours.toString().padStart(2, '0');
	$: formattedCountdownMinutes = countdown?.minutes.toString().padStart(2, '0');
	$: formattedCountdownSeconds = countdown?.seconds.toString().padStart(2, '0');

	function toggleCountdown() {
		showCountdown.update((value) => !value);
	}

	// Make controls reactive with updated icons
	$: controls = [
		{
			icon: Timer,
			activeIcon: TimerOff,
			action: toggleCountdown,
			tooltip: $showCountdown ? 'Show Time' : 'Show Countdown',
			isActive: $showCountdown
		},
		{
			icon: Clock12,
			activeIcon: Clock4,
			action: toggleTimeFormat,
			tooltip: $is24Hour ? 'Switch to 12h' : 'Switch to 24h',
			isActive: $is24Hour
		},
		{
			icon: Palette,
			activeIcon: PaintBucket,
			action: () => cycleTheme(1),
			tooltip: 'Change Theme',
			isActive: false
		}
	];

	// Add icon animation function
	function animateIcon(element: HTMLElement) {
		// Create a more complex animation sequence
		gsap.timeline()
			.to(element, {
				scale: 0.8,
				rotate: -15,
				duration: 0.15,
				ease: "power2.in"
			})
			.to(element, {
				scale: 1.1,
				rotate: 15,
				duration: 0.2,
				ease: "back.out(2)"
			})
			.to(element, {
				scale: 1,
				rotate: 0,
				duration: 0.15,
				ease: "power2.out"
			});
	}

	// Add type for click event with CustomEvent
	function handleIconClick(e: CustomEvent) {
		const target = e.currentTarget as HTMLElement;
		animateIcon(target);
	}

	// Update theme glow color
	$: if (typeof document !== 'undefined') {
		document.documentElement.style.setProperty('--theme-glow', themeConfig.dock.glow);
	}

	// Add mousemove handler to the main container
	function handleMouseMove(e: MouseEvent) {
		showControlsTemporarily();
	}

	// Add refs for countdown elements
	let countdownDaysElement: HTMLSpanElement;
	let countdownHoursElement: HTMLSpanElement;
	let countdownMinutesElement: HTMLSpanElement;
	let countdownSecondsElement: HTMLSpanElement;

	// Add previous values for countdown
	let prevCountdownDays = countdown?.days;
	let prevCountdownHours = countdown?.hours;
	let prevCountdownMinutes = countdown?.minutes;
	let prevCountdownSeconds = countdown?.seconds;

	// Add countdown transitions
	$: if (countdownDaysElement && countdown?.days !== prevCountdownDays) {
		const direction = countdown.days < prevCountdownDays ? -1 : 1;
		gsap.fromTo(
			countdownDaysElement,
			{
				y: direction * 20,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.4,
				ease: 'power2.out'
			}
		);
		prevCountdownDays = countdown.days;
	}

	$: if (countdownHoursElement && countdown?.hours !== prevCountdownHours) {
		const direction = countdown.hours < prevCountdownHours ? -1 : 1;
		gsap.fromTo(
			countdownHoursElement,
			{
				y: direction * 20,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.4,
				ease: 'power2.out'
			}
		);
		prevCountdownHours = countdown.hours;
	}

	$: if (countdownMinutesElement && countdown?.minutes !== prevCountdownMinutes) {
		const direction = countdown.minutes < prevCountdownMinutes ? -1 : 1;
		gsap.fromTo(
			countdownMinutesElement,
			{
				y: direction * 20,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.4,
				ease: 'power2.out'
			}
		);
		prevCountdownMinutes = countdown.minutes;
	}

	$: if (countdownSecondsElement && countdown?.seconds !== prevCountdownSeconds) {
		const direction = countdown.seconds < prevCountdownSeconds ? -1 : 1;
		gsap.fromTo(
			countdownSecondsElement,
			{
				y: direction * 20,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.4,
				ease: 'power2.out'
			}
		);
		prevCountdownSeconds = countdown.seconds;
	}
</script>

<div
	class="flex flex-col items-center justify-center min-h-[100dvh] text-center gap-2 sm:gap-4 md:gap-8 p-2 sm:p-4 md:p-6 perspective"
	on:mousemove={handleMouseMove}
	on:touchstart={showControlsTemporarily}
	role="main"
	aria-label="Time Display"
>
	<!-- Time Container with adjusted padding -->
	<div
		bind:this={timeElement}
		class="relative time-container backdrop-blur-md {themeConfig.accent} {themeConfig.shadow} 
               p-2 sm:p-4 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-[92vw] sm:max-w-2xl md:max-w-3xl mx-auto
               border border-white/5 hover:border-white/10 transition-all duration-500 min-h-[200px] sm:min-h-[250px] flex flex-col justify-center"
	>
		<!-- Time Display with reduced margins -->
		{#if !$showCountdown}
			<div class="flex-1 flex flex-col justify-center">
				<div
					class="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-wide sm:tracking-wider mb-1 sm:mb-2 md:mb-4 select-none"
				>
					<span bind:this={hoursElement} class="time-segment">{formattedHours}</span>
					<span class="time-separator">:</span>
					<span bind:this={minutesElement} class="time-segment">{formattedMinutes}</span>
					<span class="time-separator">:</span>
					<span bind:this={secondsElement} class="time-segment">{formattedSeconds}</span>
					{#if !$is24Hour}
						<span
							class="text-sm xs:text-base sm:text-xl md:text-2xl ml-1 sm:ml-2 md:ml-4 opacity-60 font-light"
							>{ampm}</span
						>
					{/if}
				</div>
			</div>
		{:else}
			<div class="flex-1 flex flex-col justify-center">
				<div
					class="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-wide sm:tracking-wider mb-1 sm:mb-2 md:mb-4 select-none"
				>
					<div class="text-xs sm:text-sm uppercase tracking-wider opacity-60 mb-1 sm:mb-2">
						Time until {new Date().getFullYear() + 1}
					</div>
					<div class="flex items-center justify-center gap-3 flex-wrap">
						<span bind:this={countdownDaysElement} class="time-segment">{formattedCountdownDays}</span>
						<span class="text-2xl opacity-50 mx-1">d</span>
						<span bind:this={countdownHoursElement} class="time-segment">{formattedCountdownHours}</span>
						<span class="text-2xl opacity-50 mx-1">h</span>
						<span bind:this={countdownMinutesElement} class="time-segment">{formattedCountdownMinutes}</span>
						<span class="text-2xl opacity-50 mx-1">m</span>
						<span bind:this={countdownSecondsElement} class="time-segment">{formattedCountdownSeconds}</span>
						<span class="text-2xl opacity-50 mx-1">s</span>
					</div>
				</div>
			</div>
		{/if}

		<!-- Additional Time Information with reduced spacing -->
		<div class="time-info-static mt-1 sm:mt-2">
			<TimeInfo />
		</div>
	</div>

	<!-- Dock controls with adjusted position -->
	<div
		class="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out"
		class:opacity-0={!showControls}
		class:pointer-events-none={!showControls}
		class:translate-y-8={!showControls}
		on:mouseenter={handleDockMouseEnter}
		on:mouseleave={handleDockMouseLeave}
		role="toolbar"
		tabindex="0"
		aria-label="Time display controls"
	>
		<div
			class="flex items-center gap-2 p-2 rounded-full backdrop-blur-md {themeConfig.dock.bg} {themeConfig.dock.border} shadow-lg"
			transition:slide|local={{ duration: 300 }}
		>
			{#each controls as control, index}
				<button 
					class="dock-button group relative" 
					on:click={control.action}
					style="--index: {index}"
					aria-label={control.tooltip}
				>
					<div class="relative z-10">
						<svelte:component
							this={control.isActive ? control.activeIcon : control.icon}
							class="icon-base {control.isActive ? 'icon-active' : 'icon-inactive'}"
							strokeWidth={1.5}
							on:click={handleIconClick}
						/>
					</div>

					<!-- Enhanced Tooltip -->
					<div 
						class="tooltip absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs rounded-lg 
								opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap
								{themeConfig.dock.bg} {themeConfig.dock.border} backdrop-blur-md"
						style="--tooltip-delay: {index * 50}ms"
						>
						{control.tooltip}
					</div>

					<!-- Enhanced Hover/Active Background -->
					<div 
						class="absolute inset-0 rounded-full transition-all duration-300 -z-1 {control.isActive ? 'bg-white/10' : 'bg-white/0'}"
					/>
				</button>
			{/each}
		</div>
	</div>

	<!-- Indicator text with adjusted position -->
	{#if !showControls}
		<button
			class="fixed bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs opacity-30 hover:opacity-50 transition-opacity"
			on:click={showControlsTemporarily}
			on:keydown={(e) => e.key === 'Enter' && showControlsTemporarily()}
			transition:fade={{ duration: 200 }}
		>
			Move mouse or tap to show controls
		</button>
	{/if}
</div>

<style lang="postcss">
	.perspective {
		perspective: 1000px;
	}

	.time-segment {
		@apply inline-block min-w-[2ch] font-mono relative;
		text-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
		font-feature-settings: 'tnum';
		transform-style: preserve-3d;
	}

	.time-separator {
		@apply opacity-50 mx-2;
		animation: pulse 2s infinite;
	}

	.time-container {
		transform-style: preserve-3d;
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.25),
			0 0 0 1px rgba(255, 255, 255, 0.1);
	}

	.control-button {
		@apply px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg bg-white/5 hover:bg-white/10 
               border border-white/10 hover:border-white/20
               transition-all duration-300 uppercase tracking-wide backdrop-blur-sm;
		transform-style: preserve-3d;
		backface-visibility: hidden;
	}

	.control-button:hover {
		transform: translateY(-2px) scale(1.05);
	}

	.control-button:active {
		transform: translateY(0) scale(0.95);
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 0.6;
		}
	}

	.dock-button {
		@apply w-10 h-10 rounded-full flex items-center justify-center 
			   transition-all duration-300 ease-out;
		will-change: transform;
	}

	.dock-button:hover {
		transform: translateY(-4px);
	}

	.dock-button:active {
		transform: translateY(0);
	}

	/* Remove glow effects */
	.dock-button::before,
	.dock-button::after {
		display: none;
	}

	/* Simplify tooltip styles */
	.tooltip {
		@apply shadow-lg;
		transform: translateY(10px);
		transition: all 0.2s ease-out;
		will-change: transform, opacity;
	}

	.dock-button:hover .tooltip {
		@apply opacity-100;
		transform: translateY(0);
	}

	/* Enhanced icon styles */
	.icon-base {
		@apply w-5 h-5;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		will-change: transform, filter, opacity;
	}

	.icon-active {
		@apply text-white stroke-2;
		filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
	}

	.icon-inactive {
		@apply text-white/70;
	}

	/* Enhanced icon hover effects */
	.dock-button:hover .icon-base {
		transform: scale(1.1);
		filter: brightness(1.2);
	}

	.dock-button:active .icon-base {
		transform: scale(0.9);
	}

	/* Icon state transitions */
	.icon-base {
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	/* Icon hover animation */
	@keyframes icon-bounce {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.1); }
	}

	.dock-button:hover .icon-base {
		animation: icon-bounce 1s infinite;
	}

	/* Active icon pulse effect */
	@keyframes icon-pulse {
		0%, 100% { 
			filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
			transform: scale(1);
		}
		50% { 
			filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.6));
			transform: scale(1.05);
		}
	}

	.icon-active {
		animation: icon-pulse 2s infinite;
	}

	/* Icon click effect */
	.dock-button:active .icon-base {
		transform: scale(0.9) rotate(-10deg);
		transition-duration: 0.1s;
	}

	/* Ripple Effect */
	@keyframes ripple {
		0% {
			transform: scale(0.8);
			opacity: 1;
		}
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}

	.dock-button:active::before {
		animation: ripple 0.6s ease-out;
	}

	/* Neighboring Button Effect */
	.dock-button:hover + .dock-button {
		transform: translateX(4px);
	}

	.dock-button:hover + .dock-button + .dock-button {
		transform: translateX(2px);
	}

	/* Enhanced Tooltip Styles */
	.tooltip {
		@apply shadow-lg;
		transform: translateY(20px) scale(0.95);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		transition-delay: var(--tooltip-delay, 0ms);
		will-change: transform, opacity;
	}

	.tooltip-content {
		@apply relative z-10;
	}

	/* Tooltip Arrow */
	.tooltip-arrow {
		@apply absolute left-1/2 bottom-0 w-2 h-2 -translate-x-1/2 translate-y-1/2 rotate-45;
		background: inherit;
		border-right: 1px solid rgba(255, 255, 255, 0.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	/* Enhanced Tooltip Animation */
	.dock-button:hover .tooltip {
		@apply opacity-100;
		transform: translateY(0) scale(1);
	}

	/* Remove animation from time info */
	.time-info-static {
		@apply relative;
		transform: none !important;
		animation: none !important;
	}
</style>
