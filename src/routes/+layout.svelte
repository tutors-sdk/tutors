<script lang="ts">
  import "../app.css";
  import { tutorsConnectService } from "$lib/services/connect";
  import type { PageData } from "./$types";
  import { browser } from "$app/environment";
  import { themeService } from "$lib/services/themes/services/themes.svelte";
  import { locale, SUPPORTED_LOCALES } from "$lib/services/i18n";
  import { goto } from "$app/navigation";
  import { Toast } from "@skeletonlabs/skeleton-svelte";
  import { toaster } from "$lib/stores/toaster";

  interface Props {
    data: PageData;
    children: import("svelte").Snippet;
  }
  let { data, children }: Props = $props();

  if (data?.user) {
    tutorsConnectService.reconnect(data.user);
  }

  if (browser) {
    themeService.initDisplay();
    if (data?.locale && SUPPORTED_LOCALES.includes(data.locale)) {
      locale.value = data.locale;
    }
  }

  $effect(() => {
    if (browser) {
      document.documentElement.lang = locale.value;
    }
  });
</script>

{@render children()}

<Toast.Group {toaster}>
  {#snippet children(toast)}
    <Toast {toast} class="border-surface-300 dark:border-surface-600 bg-surface-100 dark:bg-surface-900 rounded-xl border-[1px] p-4 shadow-lg">
      <div class="flex items-start gap-3">
        <div class="flex-1">
          <Toast.Title class="font-bold text-sm">{toast.title}</Toast.Title>
          <Toast.Description class="text-sm text-surface-500 mt-1">{toast.description}</Toast.Description>
        </div>
        <div class="flex items-center gap-2">
          {#if toast.meta?.actionUrl}
            <button
              class="px-3 py-1.5 rounded-lg text-xs font-medium preset-filled-primary-500"
              onclick={() => { toaster.dismiss(toast.id); goto(toast.meta.actionUrl); }}
            >
              {toast.meta.actionLabel ?? "Go"}
            </button>
          {/if}
          <Toast.CloseTrigger class="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 text-lg leading-none">&times;</Toast.CloseTrigger>
        </div>
      </div>
    </Toast>
  {/snippet}
</Toast.Group>
