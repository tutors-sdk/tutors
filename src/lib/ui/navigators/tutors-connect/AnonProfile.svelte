<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton-svelte";
  import MenuItem from "$lib/ui/components/MenuItem.svelte";

  import { PUBLIC_ANON_MODE } from "$env/static/public";
  import Menu from "$lib/ui/components/Menu.svelte";
  import { t } from "$lib/services/i18n";

  interface Props {
    redirect?: string;
  }
  let { redirect = "" }: Props = $props();
</script>

{#snippet menuSelector()}
  <div class="mt-2 flex items-center">
    <Avatar classes="size-9" src="/tutors-profile.png" name={t("menu.anonName")} />
  </div>
{/snippet}

{#snippet menuContent()}
  <ul class="space-y-6">
    {#if PUBLIC_ANON_MODE !== "TRUE"}
      <MenuItem link="/auth{redirect}" text={t("menu.connect")} type="github" />
      <MenuItem link="/" text={t("menu.home")} type="tutors" />
    {/if}
  </ul>
{/snippet}

<Menu {menuSelector} {menuContent} ariaLabel={t("menu.anonName")} />
