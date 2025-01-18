import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { sviconVitePlugin } from './src/lib/plugins/vite-plugin-svelte-svicon.js';

export default defineConfig({
	plugins: [sviconVitePlugin({ mode: "local-cache" }), sveltekit()],
});
