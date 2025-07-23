<script lang="ts">
	import { m } from '$lib/paraglide/messages';
</script>

<main>
	<h1 class="mt-5 text-3xl font-bold">{m.connectNotifications()}</h1>
	<p>{m.connectNotificationsExplaination()}</p>
	<h2 class="mt-5 text-2xl font-bold">{m.downloadTheNTFYApp()}</h2>
	<p>{m.downloadTheNTFYAppExplaination()}</p>
	<a href="https://ntfy.sh">
		<button type="button" class="btn preset-filled-primary-500">{m.downloadNTFY()}</button>
	</a>

	<h2 class="mt-5 text-2xl font-bold">{m.downloadTheNTFYApp()}</h2>
	<p>{m.downloadTheNTFYAppExplaination()}</p>
	<a href="https://ntfy.sh">
		<button type="button" class="btn preset-filled-primary-500">{m.downloadNTFY()}</button>
	</a>
</main>
