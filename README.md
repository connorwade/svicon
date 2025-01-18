# Svicon

Trying out an idea for a better icon package with sveltekit.

Definitely not ready. Experiment at your own risk.

## Usage

Currently, you need to use the vite plugin with the component. The vite plugin fetches the optimized css file and writes it to `./src/svicon.css`.

```js
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { sviconVitePlugin } from './src/lib/plugins/vite-plugin-svelte-svicon.js';

export default defineConfig({
	plugins: [sviconVitePlugin({ mode: "local-cache" }), sveltekit()],
});
```

You need to import `svicon.css` either in your `+layout.svelte` or your main css file.

```css
@import './svicon.css';
```

```svelte
<script>
    import '../svicon.css';
</script>
```

Then you can use the `Svicon` component for every material symbol icon there currently is.

```svelte
<script>
    import Svicon from 'svicon/Svicon.svelte'
</script>

<Svicon iconName="search" type="outlined" />
```

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish
```
