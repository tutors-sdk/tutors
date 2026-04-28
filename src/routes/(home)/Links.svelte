<script lang="ts">
  import Icon from "$lib/ui/components/Icon.svelte";
</script>

<div class="my-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
  <a
    class="btn bg-primary-700 hover:bg-primary-600 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.03] focus:ring-2 focus:ring-primary-500 focus:outline-none sm:flex-1"
    href="/course/tutors-reference-manual"
    rel="noreferrer"
  >
    <Icon type="note" /> Read the docs
  </a>
  <a
    class="btn border-primary-700 text-primary-700 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-300 dark:hover:bg-primary-900/40 inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition hover:scale-[1.03] focus:ring-2 focus:ring-primary-500 focus:outline-none sm:flex-1"
    href="/catalogue"
    rel="noreferrer"
  >
    <Icon type="live" /> Catalogue
  </a>
  <a
    class="btn border-primary-700 text-primary-700 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-300 dark:hover:bg-primary-900/40 inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition hover:scale-[1.03] focus:ring-2 focus:ring-primary-500 focus:outline-none sm:flex-1"
    href="/live"
    rel="noreferrer"
  >
    <Icon type="tutorsTime" /> Live
  </a>
  <a
    class="btn border-surface-400 text-surface-700 hover:bg-surface-100 dark:border-surface-500 dark:text-surface-200 dark:hover:bg-surface-800 inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition hover:scale-[1.03] focus:ring-2 focus:ring-surface-500 focus:outline-none sm:flex-1"
    href="https://github.com/tutors-sdk/tutors"
    target="_blank"
    rel="noreferrer"
  >
    <Icon type="github" /> Source
  </a>
</div>
