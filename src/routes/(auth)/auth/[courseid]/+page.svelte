<script lang="ts">
  import SigninWithGithub from "../SigninWithGithub.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();
</script>

<SigninWithGithub redirect="/course/{data.courseId}" />
