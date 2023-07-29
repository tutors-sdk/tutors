<script lang="ts">
	import type { PageData } from './$types';
	import TopDeck from 'tutors-ui/lib/Organisms/CardDeck/TopDeck.svelte';
	export let data: PageData;
</script>

<TopDeck lo={data.topic.lo} />
