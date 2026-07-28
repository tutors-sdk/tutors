<script lang="ts">
  let {
    events,
    width = 120,
    height = 24
  } = $props<{
    events: Array<{ ts: number }>;
    width?: number;
    height?: number;
  }>();

  const points = $derived.by(() => {
    if (events.length < 2) return [];
    const sorted = [...events].sort((a, b) => a.ts - b.ts);
    const minTs = sorted[0].ts;
    const maxTs = sorted[sorted.length - 1].ts;
    const range = maxTs - minTs || 1;
    const padding = 4;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;
    return sorted.map((e, i) => ({
      x: padding + (e.ts - minTs) / range * usableWidth,
      y: padding + (i / (sorted.length - 1)) * usableHeight
    }));
  });

  const polylinePoints = $derived(points.map((p) => `${p.x},${p.y}`).join(" "));
</script>

<svg {width} {height} class="inline-block" viewBox="0 0 {width} {height}">
  {#if points.length >= 2}
    <polyline
      points={polylinePoints}
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.5"
    />
    {#each points as point}
      <circle cx={point.x} cy={point.y} r="2" fill="currentColor" />
    {/each}
  {:else if events.length === 1}
    <circle cx={width / 2} cy={height / 2} r="3" fill="currentColor" />
  {:else}
    <text x={width / 2} y={height / 2 + 4} text-anchor="middle" font-size="10" fill="currentColor" opacity="0.4">--</text>
  {/if}
</svg>
