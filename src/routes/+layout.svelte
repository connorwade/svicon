<script lang="ts">
	import Svicon from '$lib/Svicon.svelte';
	import Bar from './Bar.svelte';
	import '../main.css';
	import '../svicon.css';

	let { children } = $props();
</script>

<a href="/route1">
	<Svicon iconName="search" type="outlined" />
</a>

<Bar />

{@render children()}
