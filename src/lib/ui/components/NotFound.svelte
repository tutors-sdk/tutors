<script lang="ts">
  import { onMount } from "svelte";
  import { t } from "$lib/services/i18n";

  interface Props {
    params: Record<string, string> | null;
  }
  let { params }: Props = $props();

  onMount(() => {
    console.log(params);
  });
</script>

<h1>{t("notFound.title")}</h1>
