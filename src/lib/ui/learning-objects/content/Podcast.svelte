<script lang="ts">
  import type { Lo, Podcast } from "@tutors/tutors-model-lib";

  interface Props {
    lo: Podcast;
  }
  let { lo }: Props = $props();

  let episodeId = lo.episode.id;
</script>

<iframe
  title={lo.title}
  data-testid="embed-iframe"
  style="border-radius:12px"
  src="https://open.spotify.com/embed/episode/{episodeId}?utm_source=generator?utm_source=generator"
  width="100%"
  height="152"
  frameBorder="0"
  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
  loading="lazy"
></iframe>

<p class="text-center text-lg italic">{lo.title}</p>
<div class="text-center text-sm italic">
  {@html lo.summary}
</div>
