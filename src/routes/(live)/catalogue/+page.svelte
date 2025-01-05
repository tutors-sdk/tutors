<script lang="ts">
  import { themeService } from "$lib/services/themes.svelte";
  import Catalogue from "$lib/ui/time/Catalogue.svelte";
  import { onMount } from "svelte";

  // import Catalogue from "$lib/ui/time/Catalogue.svelte";
  // import { title, subTitle, tabSet } from "$lib/runes";

  // tabSet.value = 4;
  interface Props {
    data: any;
  }
  let { data }: Props = $props();
  // title.value = "Tutors Catalogue";
  // subTitle.value = "Popular Tutors Courses";
</script>

<div class="w-full">
  <Catalogue courseRecords={data.courseRecords} />
</div>
