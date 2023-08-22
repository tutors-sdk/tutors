<script lang="ts">
  export let size: "btn-sm" | "btn-md" | "btn-lg" = "btn-md";
  export let label: string = "";
</script>

<button type="button" class="btn {size} variant-filled" on:click>
  {label}
</button>
