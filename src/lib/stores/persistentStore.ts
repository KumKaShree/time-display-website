import { writable as svelteWritable, type Writable } from 'svelte/store';

export function persistentWritable<T>(key: string, initialValue: T): Writable<T> {
    // Get stored value from localStorage
    const storedValue = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    const initial = storedValue ? JSON.parse(storedValue) : initialValue;

    const store = svelteWritable<T>(initial);
    
    store.subscribe(value => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }
    });

    return store;
} 