<script lang="ts">
  export let link = "";
  export let icon = "";
  export let title = "";
  export let content = "";
</script>

<a href={link} target="_blank" rel="noreferrer">
  <div
    class="card w-80 mx-auto my-4 lg:m-4 border-primary-500 border-y-8 hover:scale-105 transition-al"
  >
    <div class="card-header">
      <h3 class="card-title font-bold">{title}</h3>
    </div>
    <figure class="flex justify-center my-4">
      <iconify-icon {icon} height="150" />
    </figure>
    <div class="card-body m-4">
      <p class="card-text">
        {@html content}
      </p>
    </div>
  </div>
</a>
