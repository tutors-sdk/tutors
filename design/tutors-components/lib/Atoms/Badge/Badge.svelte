<script lang="ts">
  export let colour = "";
  export let size = "md";
</script>

<span class="badge badge-{colour} badge-{size}"><slot /></span>
