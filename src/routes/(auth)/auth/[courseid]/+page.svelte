<script lang="ts">
  import SigninWithGithub from "../SigninWithGithub.svelte";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();
</script>

<SigninWithGithub redirect="/course/{data.courseId}" />
