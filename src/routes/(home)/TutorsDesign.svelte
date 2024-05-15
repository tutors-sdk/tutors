<script lang="ts">
  import Icon from "$lib/ui/icons/Icon.svelte";
  import { Avatar } from "@skeletonlabs/skeleton";

  let elemCarousel: HTMLDivElement;
  const designs = [
    { image: "top-level", title: "Top Level Modules" },
    { image: "main-modules", title: "Module Details" },
    { image: "module-detail", title: "Modules" },
    { image: "learning-objects", title: "Learning Object Model" },
    { image: "visual-learning-objects", title: "Visual Learning Objects" },
    { image: "sub-systems", title: "Sub Systems" }
  ];
  let pos = 0;
  $: title = designs[0].title;

  function carouselLeft(): void {
    pos--;
    pos = pos % designs.length;
    const x =
      elemCarousel.scrollLeft === 0
        ? elemCarousel.clientWidth * elemCarousel.childElementCount // loop
        : elemCarousel.scrollLeft - elemCarousel.clientWidth; // step left
    elemCarousel.scroll(x, 0);
    title = designs[pos].title;
  }

  function carouselRight(): void {
    pos++;
    pos = pos % designs.length;
    const x =
      elemCarousel.scrollLeft === elemCarousel.scrollWidth - elemCarousel.clientWidth
        ? 0 // loop
        : elemCarousel.scrollLeft + elemCarousel.clientWidth; // step right
    elemCarousel.scroll(x, 0);
    title = designs[pos].title;
  }
</script>

<div class="container mx-auto justify-center items-center">
  <div class="w-full m-4">
    <h2 class="font-bold !text-5xl inline-block">
      Tutors Design: <span class="font-bold !text-5xl inline-block bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone"
        >{title}</span
      >
    </h2>
  </div>
  <div class="w-full lg:flex justify-center my-12">
    <div class="card p-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center">
      <button type="button" class="btn-icon" on:click={carouselLeft}>
        <Icon type="left"></Icon>
      </button>
      <div bind:this={elemCarousel} class="snap-x snap-mandatory scroll-smooth flex overflow-x-auto">
        {#each designs as design}
          <img class="snap-center rounded-container-token" src="/design/{design.image}.png" alt={design.title} loading="lazy" />
        {/each}
      </div>
      <button type="button" class="btn-icon" on:click={carouselRight}>
        <Icon type="right"></Icon>
      </button>
    </div>
  </div>
</div>
