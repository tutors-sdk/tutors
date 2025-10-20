<script lang="ts">
  import { fly } from 'svelte/transition';
  import type { ToastNotification } from '$lib/services/errors/types';

  interface Props {
    toast: ToastNotification;
    onDismiss: (id: string) => void;
  }

  let { toast, onDismiss }: Props = $props();

  const typeStyles = {
    success: 'bg-green-500 dark:bg-green-600 text-white',
    error: 'bg-red-500 dark:bg-red-600 text-white',
    warning: 'bg-yellow-500 dark:bg-yellow-600 text-white',
    info: 'bg-blue-500 dark:bg-blue-600 text-white'
  };

  const typeIcons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
</script>

<div
  class="pointer-events-auto flex w-full max-w-md overflow-hidden rounded-lg shadow-lg {typeStyles[toast.type]}"
  transition:fly={{ y: -20, duration: 300 }}
  role="alert"
  aria-live="polite"
>
  <div class="flex w-0 flex-1 items-center p-4">
    <div class="mr-3 flex-shrink-0">
      <span class="text-xl font-bold" aria-hidden="true">
        {typeIcons[toast.type]}
      </span>
    </div>
    <div class="flex-1">
      <p class="text-sm font-medium">{toast.message}</p>
    </div>
  </div>

  {#if toast.dismissible}
    <div class="flex border-l border-white/20">
      <button
        onclick={() => onDismiss(toast.id)}
        class="flex w-full items-center justify-center p-4 text-sm font-medium text-white hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Dismiss notification"
      >
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  {/if}
</div>

