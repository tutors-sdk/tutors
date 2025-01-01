<script lang="ts">
  import { onMount } from "svelte";

  export const githubCommits = "https://api.github.com/repos/tutors-sdk/tutors/commits";
  let id = "";
  let sha = "";

  onMount(async () => {
    // const response = await fetch("https://api.github.com/repos/tutors-sdk/tutors/commits");
    // const data = await response.json();
    // id = data[0].sha.slice(0, 7);
    // sha = data[0].sha;
  });
  const version = "11.3.0";
</script>

<a href="https://tutors.dev" target="_blank" rel="noopener noreferrer">
  <p class="pl-4">
    Tutors v{version}
  </p>
</a>
<!-- <a href="https://github.com/tutors-sdk/tutors/commit/{sha}" target="_blank" rel="noopener noreferrer"><p class="pl-4 !text-xs">Last commit {id}</p></a> -->
