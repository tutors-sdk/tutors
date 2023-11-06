<script lang="ts">
  export let value = 0;
  export let title = "";
</script>

<span class="ml-12 mr-6">
  <span class="chip text-primary-100 bg-warning-400">{value}</span>
  <div class="text-primary-500 hidden text-xs md:inline-block">{title}</div>
</span>
