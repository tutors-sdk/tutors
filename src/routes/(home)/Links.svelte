<script>
  import Icon from "$lib/ui/components/Icon.svelte";
</script>

<div class="my-4 flex flex-col items-center justify-center gap-4 md:flex-row">
  <a
    class="darkbg-primary-700 btn w-2/3 rounded bg-primary-800 text-white hover:scale-110 hover:bg-primary-600 md:w-48 dark:bg-primary-400 dark:text-black"
    href="/course/tutors-reference-manual"
    rel="noreferrer"
  >
    <Icon type="note" /> Docs
  </a>
  <a
    class="darkbg-primary-700 btn w-2/3 rounded bg-primary-800 text-white hover:scale-110 hover:bg-primary-600 md:w-48 dark:bg-primary-400 dark:text-black"
    href="https://github.com/tutors-sdk/tutors"
    target="_blank"
    rel="noreferrer"
  >
    <Icon type="github" /> Source
  </a>
  <a
    class="darkbg-primary-700 btn w-2/3 rounded bg-primary-800 text-white hover:scale-110 hover:bg-primary-600 md:w-48 dark:bg-primary-400 dark:text-black"
    href="/catalogue"
    rel="noreferrer"
  >
    <Icon type="live" /> Catalogue
  </a>
  <a
    class="darkbg-primary-700 btn w-2/3 rounded bg-primary-800 text-white hover:scale-110 hover:bg-primary-600 md:w-48 dark:bg-primary-400 dark:text-black"
    href="/live"
    rel="noreferrer"
  >
    <Icon type="time" /> Live
  </a>
</div>
