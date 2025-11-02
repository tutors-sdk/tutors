<script lang="ts">
  import { toastService } from '$lib/services/errors/toast.svelte';
  import Toast from './Toast.svelte';

  const { toasts } = toastService;
</script>

<!-- Toast container positioned at top-right of screen -->
<div
  class="pointer-events-none fixed right-0 top-0 z-50 flex flex-col items-end space-y-4 p-4 sm:p-6"
  aria-live="assertive"
  aria-atomic="true"
>
  {#each toasts.value as toast (toast.id)}
    <Toast {toast} onDismiss={toastService.dismiss.bind(toastService)} />
  {/each}
</div>

