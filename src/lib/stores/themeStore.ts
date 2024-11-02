import { persistentWritable } from './persistentStore';

export type Theme = 'dark' | 'light' | 'aurora' | 'silk' | 'midnight' | 'dawn' | 'neon' | 'ocean' | 'sunset';

interface ThemeConfig {
    background: string;
    text: string;
    accent: string;
    progress: string;
    shadow: string;
    dock: {
        bg: string;
        border: string;
        glow: string;
    };
}

export const themeConfigs: Record<Theme, ThemeConfig> = {
    dark: {
        background: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black',
        text: 'text-white',
        accent: 'bg-white/10',
        progress: 'bg-white/30',
        shadow: 'shadow-white/5',
        dock: {
            bg: 'bg-black/20',
            border: 'border-white/10',
            glow: 'rgba(255, 255, 255, 0.15)'
        }
    },
    light: {
        background: 'bg-gradient-to-br from-gray-100 via-white to-gray-100',
        text: 'text-gray-800',
        accent: 'bg-black/5',
        progress: 'bg-black/20',
        shadow: 'shadow-black/5',
        dock: {
            bg: 'bg-white/20',
            border: 'border-black/10',
            glow: 'rgba(0, 0, 0, 0.1)'
        }
    },
    silk: {
        background: 'bg-gradient-to-br from-neutral-900 via-stone-900 to-zinc-900',
        text: 'text-stone-100',
        accent: 'bg-stone-100/10',
        progress: 'bg-stone-100/30',
        shadow: 'shadow-stone-100/5',
        dock: {
            bg: 'bg-stone-900/30',
            border: 'border-stone-100/20',
            glow: 'rgba(216, 180, 254, 0.2)'
        }
    },
    aurora: {
        background: 'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-green-300 via-blue-500 to-purple-600',
        text: 'text-white',
        accent: 'bg-white/10',
        progress: 'bg-white/30',
        shadow: 'shadow-white/5',
        dock: {
            bg: 'bg-green-300/30',
            border: 'border-green-300/20',
            glow: 'rgba(103, 232, 249, 0.2)'
        }
    },
    midnight: {
        background: 'bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] from-blue-950 via-purple-900 to-blue-950',
        text: 'text-blue-100',
        accent: 'bg-blue-100/10',
        progress: 'bg-blue-100/30',
        shadow: 'shadow-blue-100/5',
        dock: {
            bg: 'bg-blue-950/30',
            border: 'border-blue-100/20',
            glow: 'rgba(103, 232, 249, 0.2)'
        }
    },
    dawn: {
        background: 'bg-gradient-to-br from-rose-900 via-pink-900 to-violet-900',
        text: 'text-rose-100',
        accent: 'bg-rose-100/10',
        progress: 'bg-rose-100/30',
        shadow: 'shadow-rose-100/5',
        dock: {
            bg: 'bg-rose-900/30',
            border: 'border-rose-100/20',
            glow: 'rgba(253, 186, 116, 0.2)'
        }
    },
    neon: {
        background: 'bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950',
        text: 'text-purple-100',
        accent: 'bg-purple-300/10',
        progress: 'bg-purple-300/30',
        shadow: 'shadow-purple-300/5',
        dock: {
            bg: 'bg-purple-950/30',
            border: 'border-purple-300/20',
            glow: 'rgba(216, 180, 254, 0.2)'
        }
    },
    ocean: {
        background: 'bg-gradient-to-br from-cyan-950 via-blue-900 to-cyan-900',
        text: 'text-cyan-100',
        accent: 'bg-cyan-300/10',
        progress: 'bg-cyan-300/30',
        shadow: 'shadow-cyan-300/5',
        dock: {
            bg: 'bg-cyan-950/30',
            border: 'border-cyan-300/20',
            glow: 'rgba(103, 232, 249, 0.2)'
        }
    },
    sunset: {
        background: 'bg-gradient-to-br from-orange-950 via-red-900 to-rose-900',
        text: 'text-orange-100',
        accent: 'bg-orange-300/10',
        progress: 'bg-orange-300/30',
        shadow: 'shadow-orange-300/5',
        dock: {
            bg: 'bg-orange-950/30',
            border: 'border-orange-300/20',
            glow: 'rgba(253, 186, 116, 0.2)'
        }
    }
};

export const currentTheme = persistentWritable<Theme>('theme', 'silk');
export const lastTheme = persistentWritable<Theme | null>('lastTheme', null);