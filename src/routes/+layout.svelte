<script lang="ts">
	import { page } from '$app/state';
	import { enableViewTransitionApi } from '$lib/helpers/viewTransitionApi.svelte';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';

	let { children } = $props();
	enableViewTransitionApi();
</script>

<svelte:head>
	<title>TODO</title>
</svelte:head>

{@render children()}

<div aria-hidden="true" style="display:none">
	{#each locales as locale, index (index)}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<Toaster containerClassName="mt-16" toastOptions={{ className: 'border-2' }} />

<style>
	:global(body) {
		@apply h-screen w-screen;
	}
</style>
