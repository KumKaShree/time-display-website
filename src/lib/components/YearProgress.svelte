<script lang="ts">
    import { timeStore } from '$lib/stores/timeStore';
    import { currentTheme, themeConfigs } from '$lib/stores/themeStore';
    import { onMount } from 'svelte';
    import gsap from 'gsap';

    $: themeConfig = themeConfigs[$currentTheme];
    
    // Calculate days
    $: date = $timeStore?.date;
    $: daysInYear = new Date(date?.getFullYear() ?? 2024, 11, 31).getDate() === 31 ? 366 : 365;
    $: currentDay = date ? Math.ceil((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    let progressBar: HTMLDivElement;
    let progressText: HTMLDivElement;
    let hasAnimated = false;
    
    onMount(() => {
        // Initial animation
        if (progressBar && !hasAnimated) {
            animateProgress();
            hasAnimated = true;
        }
    });
    
    function animateProgress() {
        // Reset to 0 first
        gsap.set(progressBar, { width: '0%' });
        
        // Animate to current progress
        gsap.to(progressBar, {
            width: `${$timeStore?.yearProgress}%`,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: function() {
                if (progressText) {
                    const currentWidth = gsap.getProperty(progressBar, "width") as number;
                    const currentDays = Math.round((currentWidth / 100) * daysInYear);
                    progressText.textContent = `${currentDays}/${daysInYear}`;
                }
            },
            onComplete: function() {
                if (progressText) {
                    progressText.textContent = `${currentDay}/${daysInYear}`;
                }
            }
        });
    }
</script>

<div class="progress-container">
    <div class="flex justify-between text-[10px] xs:text-xs sm:text-sm mb-1.5 sm:mb-2 font-medium tracking-wide">
        <span>Year Progress</span>
        <div bind:this={progressText} class="tabular-nums">{currentDay}/{daysInYear}</div>
    </div>
    <div class="w-full bg-white/10 h-1 xs:h-1.5 sm:h-2 rounded-full overflow-hidden relative">
        <div 
            bind:this={progressBar}
            class="h-full {themeConfig.progress} rounded-full relative"
            style="width: 0%"
        >
            <!-- Enhanced shimmer effect -->
            <div class="absolute inset-0">
                <div class="shimmer-container">
                    <div class="shimmer-line"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    .progress-container {
        @apply w-full;
    }

    .shimmer-container {
        @apply absolute inset-0 overflow-hidden;
        mask-image: linear-gradient(90deg, transparent, white 50%, transparent);
    }

    .shimmer-line {
        @apply absolute inset-0;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
        );
        animation: shimmer 2s infinite;
        width: 50%;
        transform: translateX(-100%);
    }

    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
    }

    @media (max-width: 360px) {
        .progress-container {
            @apply scale-95 origin-top;
        }
    }
</style> 