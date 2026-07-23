<script lang="ts">
  let {
    percentage = 0,
    size = 32,
    strokeWidth = 3
  } = $props<{
    percentage: number;
    size?: number;
    strokeWidth?: number;
  }>();

  const radius = $derived((size - strokeWidth) / 2);
  const circumference = $derived(2 * Math.PI * radius);
  const offset = $derived(circumference - (percentage / 100) * circumference);
</script>

<svg width={size} height={size} class="progress-ring" role="img" aria-label="{percentage}% complete">
  <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" stroke-width={strokeWidth} class="opacity-20" />
  <circle
    cx={size / 2}
    cy={size / 2}
    r={radius}
    fill="none"
    stroke="currentColor"
    stroke-width={strokeWidth}
    stroke-dasharray={circumference}
    stroke-dashoffset={offset}
    stroke-linecap="round"
    class="text-blue-500 transition-all duration-300"
    transform="rotate(-90 {size / 2} {size / 2})"
  />
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" class="fill-current" style="font-size: {size * 0.3}px; font-weight: 500;">
    {percentage}%
  </text>
</svg>
