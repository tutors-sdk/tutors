<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { authService } from '$lib/services/auth';
	import { analyticsService } from '$lib/services/analytics';
	import { initFirebase } from '$lib/utils/firebase';
	import { fromLocalStorage } from '$lib/utils/auth';
	import { getKeys } from '$lib/environment';
	import { currentUser } from '$lib/stores';
	import TopDeck from '$lib/ui/legacy/Organisms/CardDeck/TopDeck.svelte';

	export let data: PageData;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(async () => {
		if (getKeys().firebase.apiKey !== 'XXX') {
			initFirebase(getKeys().firebase);
			authService.checkAuth(data.course);
			if (data.course.authLevel > 0 && !data.session) {
				throw new Error('Not authorized, please log in!');
			} else {
				const user = fromLocalStorage();
				user.onlineStatus = await analyticsService.getOnlineStatus(data.course, user);
				currentUser.set(user);
				analyticsService.updateLogin(data.course.id, user);
			}
		}
	});
</script>

<TopDeck lo={data.course.lo} />
