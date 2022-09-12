<script>
  export let disabled = false;
</script>

<button {disabled} class="btn" on:click><slot /></button>
