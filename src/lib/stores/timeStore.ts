import { persistentWritable } from './persistentStore';
import { readable } from 'svelte/store';

interface TimeState {
    hours: number;
    minutes: number;
    seconds: number;
    date: Date;
    weekNumber: number;
    yearProgress: number;
    countdown: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    };
}

function calculateWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function calculateYearProgress(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const endOfYear = new Date(date.getFullYear() + 1, 0, 1);
    const total = endOfYear.getTime() - startOfYear.getTime();
    const progress = date.getTime() - startOfYear.getTime();
    return (progress / total) * 100;
}

function calculateCountdown(date: Date) {
    const currentYear = date.getFullYear();
    const nextYear = new Date(currentYear + 1, 0, 1);
    const diff = nextYear.getTime() - date.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
}

// Initialize with default values instead of null
const initialState: TimeState = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    date: new Date(),
    weekNumber: 0,
    yearProgress: 0,
    countdown: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    }
};

// Use persistentWritable for all preferences
export const is24Hour = persistentWritable<boolean>('timeFormat', true);
export const showCountdown = persistentWritable<boolean>('showCountdown', false);

export const timeStore = readable<TimeState>(initialState, (set) => {
    const updateTime = () => {
        const now = new Date();
        set({
            hours: now.getHours(),
            minutes: now.getMinutes(),
            seconds: now.getSeconds(),
            date: now,
            weekNumber: calculateWeekNumber(now),
            yearProgress: calculateYearProgress(now),
            countdown: calculateCountdown(now)
        });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
}); 