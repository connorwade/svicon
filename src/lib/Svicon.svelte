<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { MaterialSymbolName } from './types/material-symbols.js';
	let {
		iconName,
		type,
		class: className
	}: {
		iconName: MaterialSymbolName;
		type: 'outlined' | 'rounded' | 'sharp';
		class?: HTMLAttributes<HTMLSpanElement>['class'];
	} = $props();
</script>

<!-- 
@component
iconName is name of the Material Symbol to display
type is the style of the icon

This component also uses the following style props:
--fill: the fill of the icon's font; can be 1 or 0; default is 0
--weight: the wght of the icon's font; can be from 100 - 700; default is 400
--grade: the grad of the icon's font; default is 0
--optical-size: the opsz of the icon's font; can be 20 to 48; default is 24
--size: the font-size of the icon's font; default is 24px

-->
<span class="material-symbols-{type} {className}">
	{iconName}
</span>

<style>
	span {
		font-size: var(--size, 24px);
		font-variation-settings:
			'FILL' var(--fill, 0),
			'wght' var(--weight, 400),
			'GRAD' var(--grade, 0),
			'opsz' var(--optical-size, 24);
	}
</style>
