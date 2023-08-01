<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { authService } from 'tutors-reader-lib/src/services/auth-service';
	import { initFirebase } from 'tutors-reader-lib/src/utils/firebase-utils';
	import { getKeys } from '$lib/environment';
	import TopDeck from '$lib/ui/legacy/Organisms/CardDeck/TopDeck.svelte';

	export let data: PageData;

	onMount(async () => {
		if (getKeys().firebase.apiKey !== 'XXX') {
			initFirebase(getKeys().firebase);
			// authService.setCredentials(getKeys().auth0);
			// authService.checkAuth(data.course);
		}
	});
</script>

<TopDeck lo={data.course.lo} />
