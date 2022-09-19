<script lang="ts">
  export let colour = "primary";
  export let size = "md";
</script>

<span class={["badge", `badge-${colour}`, `badge-${size}`].join(" ")}
  ><slot /></span
>
