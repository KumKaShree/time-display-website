<script lang="ts">
    import { timeStore } from '$lib/stores/timeStore';
    import { fade, slide } from 'svelte/transition';
    import YearProgress from './YearProgress.svelte';

    // Format date
    $: date = $timeStore?.date;
    $: formattedDate = date?.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
</script>

<div class="time-info-container">
    <!-- Simple Date Display with reduced margins -->
    <div class="text-base sm:text-lg mb-2 sm:mb-3 font-light text-center opacity-80">
        {formattedDate}
    </div>

    <!-- Year Progress with reduced padding -->
    <div class="px-1">
        <YearProgress />
    </div>
</div>

<style lang="postcss">
    .time-info-container {
        @apply flex flex-col w-full max-w-[90vw] sm:max-w-md mx-auto;
        transform: none !important;
        animation: none !important;
    }
</style> 