<script>
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
</script>

<div class="my-4 flex flex-col items-center justify-center gap-4 md:flex-row">
  <a
    class="btn bg-primary-800 hover:bg-primary-600 dark:bg-primary-400 darkbg-primary-700 w-2/3 rounded text-white hover:scale-110 dark:text-black"
    href="/course/tutors-reference-manual"
    rel="noreferrer"
  >
    <Icon type="note" />&nbsp; Docs
  </a>
  <a
    class="btn bg-primary-800 hover:bg-primary-600 dark:bg-primary-400 darkbg-primary-700 w-2/3 rounded text-white hover:scale-110 dark:text-black"
    href="https://github.com/tutors-sdk/tutors"
    target="_blank"
    rel="noreferrer"
  >
    <Icon type="github" />&nbsp; Source
  </a>
  <a
    class="btn bg-primary-800 hover:bg-primary-600 dark:bg-primary-400 darkbg-primary-700 w-2/3 rounded text-white hover:scale-110 dark:text-black"
    href="https://live.tutors.dev/catalogue"
    target="_blank"
    rel="noreferrer"
  >
    <Icon type="live" />&nbsp; Catalogue
  </a>
  <a
    class="btn bg-primary-800 hover:bg-primary-600 dark:bg-primary-400 darkbg-primary-700 w-2/3 rounded text-white hover:scale-110 dark:text-black"
    href="https://live.tutors.dev"
    target="_blank"
    rel="noreferrer"
  >
    <Icon type="time" />&nbsp; Live
  </a>
</div>
