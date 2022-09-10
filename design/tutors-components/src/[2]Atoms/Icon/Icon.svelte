<script lang="ts">
  import Icon from "@iconify/svelte";
  export let icon = "";
  export let colour = "";
  export let width = 20;
  export let height = 20;
</script>

<Icon {icon} class="text-{colour} w-{width} h-{height}" />
