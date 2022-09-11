<script lang="ts">
  import Icon from "@iconify/svelte";
  export let icon = "";
  export let colour = "primary";
  export let size = "20";
</script>

<Icon {icon} class="text-{colour}" width={size} />
