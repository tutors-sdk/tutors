<script>
  import Icon from "@iconify/svelte";
</script>

<div class="my-4 flex flex-col items-center justify-center gap-4 md:flex-row">
  <a
    class="btn btn-xl w-60 bg-primary-500 font-bold text-white transition-all hover:scale-105"
    href="/course/tutors-reference-manual"
    rel="noreferrer"
  >
    <Icon icon="fluent:notepad-16-regular" />&nbsp; Docs
  </a>
  <a
    class="btn btn-xl w-60 bg-primary-500 font-bold text-white transition-all hover:scale-105"
    href="https://github.com/tutors-sdk/tutors"
    target="_blank"
    rel="noreferrer"
  >
    <Icon icon="mdi:github" />&nbsp; Source
  </a>
  <a
    class="btn btn-xl w-60 bg-primary-500 font-bold text-white transition-all hover:scale-105"
    href="https://live.tutors.dev"
    target="_blank"
    rel="noreferrer"
  >
    <Icon icon="fluent:people-list-24-filled" />&nbsp; Live
  </a>
</div>
