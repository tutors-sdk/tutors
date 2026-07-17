<script lang="ts">
  import { page } from "$app/state";
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
  <h1 class="text-6xl font-bold text-error-500">{page.status}</h1>
  <p class="mt-4 text-xl">{page.error?.message ?? "Something went wrong"}</p>
  <a href="/" class="btn preset-tonal-primary mt-8">Go Home</a>
</div>
