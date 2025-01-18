<script>
	import Svicon from '$lib/Svicon.svelte';
</script>

<Svicon iconName="bar_chart" type="outlined" />
<Svicon iconName="bar_chart" type="rounded" />
<Svicon iconName="bar_chart" type="sharp" />
<Svicon iconName="settings" type="outlined" />
<Svicon class="red" iconName="allergy" type="outlined" />

<style>
	:global(.red) {
		color: red;
	}
</style>
