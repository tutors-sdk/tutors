<script>
  export let showOnPx = 150;
  let hidden = true;

  function goTop() {
    document.body.scrollIntoView();
  }

  function scrollContainer() {
    return document.documentElement || document.body;
  }

  function handleOnScroll() {
    if (!scrollContainer()) {
      return;
    }

    if (scrollContainer().scrollTop > showOnPx) {
      hidden = false;
    } else {
      hidden = true;
    }
  }
</script>

<svelte:window on:scroll={handleOnScroll} />

<button type="button" class="btn btn-circle btn-sm back-to-top" on:click={goTop} class:hidden>
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    class="h-4 w-4"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    ><path
      fill="currentColor"
      d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"
    /></svg
  >
</button>

<style>
  .back-to-top {
    opacity: 1;
    transition: opacity 0.5s, visibility 0.5s;
    position: fixed;
    z-index: 40;
    right: 20px;
    user-select: none;
    bottom: 20px;
  }

  .back-to-top.hidden {
    opacity: 0;
    visibility: hidden;
  }
</style>
