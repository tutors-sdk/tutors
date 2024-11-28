<script>
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
</script>

<div class="my-4 flex flex-col items-center justify-center gap-4 md:flex-row">
  <a
    class="btn bg-primary-800 hover:bg-primary-600 dark:bg-primary-400 darkbg-primary-700 w-2/3 rounded text-white hover:scale-110 dark:text-black md:w-48"
    href="/course/tutors-reference-manual"
    rel="noreferrer"
  >
    <Icon type="note" /> Docs
  </a>
  <a
    class="btn bg-primary-800 hover:bg-primary-600 dark:bg-primary-400 darkbg-primary-700 w-2/3 rounded text-white hover:scale-110 dark:text-black md:w-48"
    href="https://github.com/tutors-sdk/tutors"
    target="_blank"
    rel="noreferrer"
  >
    <Icon type="github" /> Source
  </a>
  <a
    class="btn bg-primary-800 hover:bg-primary-600 dark:bg-primary-400 darkbg-primary-700 w-2/3 rounded text-white hover:scale-110 dark:text-black md:w-48"
    href="https://live.tutors.dev/catalogue"
    target="_blank"
    rel="noreferrer"
  >
    <Icon type="live" /> Catalogue
  </a>
  <a
    class="btn bg-primary-800 hover:bg-primary-600 dark:bg-primary-400 darkbg-primary-700 w-2/3 rounded text-white hover:scale-110 dark:text-black md:w-48"
    href="https://live.tutors.dev"
    target="_blank"
    rel="noreferrer"
  >
    <Icon type="time" /> Live
  </a>
</div>
