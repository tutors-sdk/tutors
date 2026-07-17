<script lang="ts">
  import Icon from "$lib/ui/components/Icon.svelte";
  import { t } from "$lib/services/i18n";
</script>

<div class="my-4 flex flex-col items-center justify-center gap-4 md:flex-row">
  <a
    class="darkbg-primary-700 dark:bg-teritary-400 btn w-2/3 rounded-sm bg-primary-800 text-white hover:scale-110 hover:bg-primary-600 md:w-48 dark:text-white"
    href="/course/tutors-reference-manual"
    rel="noreferrer"
  >
    <Icon type="note" /> {t("home.docs")}
  </a>
  <a
    class="darkbg-primary-700 dark:bg-teritary-400 btn w-2/3 rounded-sm bg-primary-800 text-white hover:scale-110 hover:bg-primary-600 md:w-48 dark:text-white"
    href="https://github.com/tutors-sdk/tutors"
    target="_blank"
    rel="noreferrer"
  >
    <Icon type="github" /> {t("home.source")}
  </a>
  <a
    class="darkbg-primary-700 dark:bg-teritary-400 btn w-2/3 rounded-sm bg-primary-800 text-white hover:scale-110 hover:bg-primary-600 md:w-48 dark:text-white"
    href="/catalogue"
    rel="noreferrer"
  >
    <Icon type="live" /> {t("home.catalogue")}
  </a>
  <a
    class="darkbg-primary-700 dark:bg-teritary-400 btn w-2/3 rounded-sm bg-primary-800 text-white hover:scale-110 hover:bg-primary-600 md:w-48 dark:text-white"
    href="/live"
    rel="noreferrer"
  >
    <Icon type="tutorsTime" /> {t("home.live")}
  </a>
</div>
