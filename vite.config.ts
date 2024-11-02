import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		target: 'esnext',
		minify: 'terser',
		cssMinify: true,
		rollupOptions: {
			output: {
				manualChunks: {
					lucide: ['lucide-svelte']
				}
			}
		},
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		},
		reportCompressedSize: false
	},
	ssr: {
		noExternal: ['lucide-svelte']
	},
	optimizeDeps: {
		include: ['gsap', 'lucide-svelte']
	}
});