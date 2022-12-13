<script lang="ts">
  import { StudentCardDeck2 } from "tutors-ui";
  import type { PageData } from "./$types";
  export let data: PageData;
</script>

<svelte:head>
  <title>{data.course.lo.title} Live Students online Now</title>
</svelte:head>
<StudentCardDeck2 />
