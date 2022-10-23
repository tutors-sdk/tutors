<script>
  import TutorsIcon from "./support/TutorsIcon.svelte";
  export let title = "";
  export let subTitle = "";
</script>

<div class="container mx-auto mt-8">
  <div class="navbar rounded-box mb-2 justify-center bg-neutral p-4 text-neutral-content shadow-lg">
    <div class="flex-1">
      <TutorsIcon />
      <div class="mx-2 hidden flex-1 px-2 lg:block">
        <p class="text-lg font-bold">{title}</p>
        <p class="text-sm font-bold">{subTitle}</p>
      </div>
    </div>
    <a href="https://tutors.dev" target="_window">
      <div class="btn-ghost btn rounded-2xl">Homepage</div>
    </a>
  </div>
</div>
