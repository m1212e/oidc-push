<script lang="ts">
	import { graphql } from '$houdini';
	import { m } from '$lib/paraglide/messages';
	import toast from 'svelte-french-toast';
	import type { PageData } from './$houdini';
	import { LogOut, Plus, Copy, Undo2, Trash2, SquareArrowOutUpRight, Send } from 'lucide-svelte';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { configPublic } from '$config/public';

	let { data }: { data: PageData } = $props();
	let topicQuery = $derived(data.TopicQuery);
	let topic = $derived($topicQuery.data?.findManyUser.at(0)?.ntfyTopic);
	let resetModalOpenState = $state(false);
	let removeModalOpenState = $state(false);

	const ResetTopicMutation = graphql(`
		mutation ResetTopicMutation {
			resetTopic {
				id
				ntfyTopic
			}
		}
	`);

	const RemoveTopicMutation = graphql(`
		mutation RemoveTopicMutation {
			removeTopic {
				id
				ntfyTopic
			}
		}
	`);

	const SendTestMutation = graphql(`
		mutation SendTestMutation {
			sendTest
		}
	`);
</script>

<main class="flex max-w-4xl flex-col justify-between p-2">
	<div>
		<h1 class="mt-8 text-3xl font-bold">{m.connectNotifications()}</h1>
		<p>{m.connectNotificationsExplaination()}</p>
		<h2 class="mt-8 text-2xl font-bold">{m.downloadTheNTFYApp()}</h2>
		<p>{m.downloadTheNTFYAppExplaination()}</p>
		<a href="https://ntfy.sh" target="_blank" rel="noopener noreferrer">
			<button type="button" class="btn preset-filled-primary-500 mt-4"
				><SquareArrowOutUpRight />{m.downloadNTFY()}</button
			>
		</a>

		<h2 class="mt-8 text-2xl font-bold">{m.createATopic()}</h2>
		<p>{m.topicExplaination()}</p>

		{#if !topic}
			<button
				type="button"
				class="btn preset-filled-primary-500 mt-4"
				onclick={() => {
					ResetTopicMutation.mutate(null);
				}}><Plus />{m.createYourTopic()}</button
			>
		{:else}
			<div class="mt-4 flex items-center">
				<input class="input text-ellipsis" type="text" disabled bind:value={topic} />

				<button
					type="button"
					class="btn preset-filled-primary-500 ml-3 p-3"
					onclick={() => {
						if (topic) {
							navigator.clipboard.writeText(topic);
							toast.success(m.copiedToClipboard());
						}
					}}><Copy />{m.copy()}</button
				>
				<button
					type="button"
					class="btn preset-filled-primary-500 ml-3 p-3"
					onclick={() => {
						resetModalOpenState = true;
					}}><Undo2 />{m.reset()}</button
				>
				<button
					type="button"
					class="btn preset-filled-primary-500 ml-3 p-3"
					onclick={() => {
						removeModalOpenState = true;
					}}><Trash2 />{m.remove()}</button
				>
			</div>
		{/if}

		<h1 class="mt-8 text-3xl font-bold">{m.subscribeToTheTopic()}</h1>
		<p>{m.subscribeToTheTopicExplaination()}</p>
		<a href="https://docs.ntfy.sh/#step-1-get-the-app">
			<button type="button" class="btn preset-filled-primary-500 mt-4">
				<SquareArrowOutUpRight />
				{m.instructions()}</button
			>
		</a>
		{#if configPublic.PUBLIC_NTFY_HOST !== 'https://ntfy.sh'}
			<p class="mt-2">{m.differentServerExplaination()}</p>
			<div class="mt-4 flex items-center">
				<input
					class="input text-ellipsis"
					type="text"
					disabled
					value={configPublic.PUBLIC_NTFY_HOST}
				/>

				<button
					type="button"
					class="btn preset-filled-primary-500 ml-3 p-3"
					onclick={() => {
						navigator.clipboard.writeText(configPublic.PUBLIC_NTFY_HOST);
						toast.success(m.copiedToClipboard());
					}}><Copy />{m.copy()}</button
				>
			</div>
		{/if}
		{#if topic}
			<h1 class="mt-8 text-3xl font-bold">{m.sendTest()}</h1>
			<p>{m.sendTestExplaination()}</p>
			<button
				type="button"
				class="btn preset-filled-primary-500 mt-4"
				onclick={async () => {
					await SendTestMutation.mutate(null);
					toast.success(m.sent());
				}}
			>
				<Send />
				{m.send()}</button
			>
		{/if}
	</div>

	<div>
		<a href="/logout">
			<button type="button" class="btn preset-filled-tertiary-500 mt-4">
				<LogOut />
				{m.logout()}</button
			>
		</a>
	</div>
</main>

<Modal
	open={resetModalOpenState}
	onOpenChange={(e) => (resetModalOpenState = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<header class="flex justify-between">
			<h2 class="h2">{m.reset()}</h2>
		</header>
		<article>
			<p class="opacity-60">
				{m.resetExplaination()}
			</p>
		</article>
		<footer class="flex justify-end gap-4">
			<button
				type="button"
				class="btn preset-tonal"
				onclick={() => {
					resetModalOpenState = false;
				}}>{m.cancel()}</button
			>
			<button
				type="button"
				class="btn preset-filled"
				onclick={() => {
					ResetTopicMutation.mutate(null);
					resetModalOpenState = false;
				}}>{m.confirm()}</button
			>
		</footer>
	{/snippet}
</Modal>

<Modal
	open={removeModalOpenState}
	onOpenChange={(e) => (removeModalOpenState = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<header class="flex justify-between">
			<h2 class="h2">{m.remove()}</h2>
		</header>
		<article>
			<p class="opacity-60">
				{m.removeExplaination()}
			</p>
		</article>
		<footer class="flex justify-end gap-4">
			<button
				type="button"
				class="btn preset-tonal"
				onclick={() => {
					removeModalOpenState = false;
				}}>{m.cancel()}</button
			>
			<button
				type="button"
				class="btn preset-filled"
				onclick={() => {
					RemoveTopicMutation.mutate(null);
					removeModalOpenState = false;
				}}>{m.confirm()}</button
			>
		</footer>
	{/snippet}
</Modal>
