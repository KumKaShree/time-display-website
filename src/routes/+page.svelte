<script lang="ts">
    import TimeDisplay from '$lib/components/TimeDisplay.svelte';
    import { currentTheme, themeConfigs } from '$lib/stores/themeStore';

    $: themeConfig = themeConfigs[$currentTheme];
</script>

<div class="min-h-screen {themeConfig.background} {themeConfig.text} relative overflow-hidden transition-all duration-700">
    <!-- Background Effects -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]" />
    <div class="absolute inset-0 backdrop-blur-[100px] opacity-30" />
    <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
    
    <!-- Animated background shapes -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -inset-[10px] opacity-50">
            {#each Array(3) as _, i}
                <div
                    class="absolute rounded-full mix-blend-overlay"
                    style="
                        width: {100 + i * 40}vh;
                        height: {100 + i * 40}vh;
                        left: calc(50% - {50 + i * 20}vh);
                        top: calc(50% - {50 + i * 20}vh);
                        animation: float-{i + 1} {20 + i * 5}s infinite ease-in-out;
                        background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
                    "
                />
            {/each}
        </div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10">
        <TimeDisplay />
    </div>
</div>

<style>
    @keyframes float-1 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        50% { transform: translate(-30px, 20px) rotate(10deg); }
    }
    
    @keyframes float-2 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        50% { transform: translate(20px, -20px) rotate(-5deg); }
    }
    
    @keyframes float-3 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        50% { transform: translate(-15px, -25px) rotate(7deg); }
    }
</style>
