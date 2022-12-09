<script lang="ts">
  import { onMount } from "svelte";

  export const githubCommits = "https://api.github.com/repos/tutors-sdk/tutors/commits";
  let id = "";
  let sha = "";

  onMount(async () => {
    const response = await fetch("https://api.github.com/repos/tutors-sdk/tutors/commits");
    const data = await response.json();
    id = data[0].sha.slice(0, 7);
    sha = data[0].sha;
  });
  const version = "7.0.0";
</script>

<footer class="mx-auto w-11/12 py-8">
  <div class="flex grid-flow-col items-center">
    <div class="inline-flex flex-1">
      <svg width="40px" viewBox="0 0 54.5 39.4" xml:space="preserve"
        ><defs></defs><g
          ><path
            fill="#37919b"
            d="M51.5,0H3C1.4,0,0,1.4,0,3v33.3c0,1.7,1.4,3,3,3h48.5c1.7,0,3-1.4,3-3V3C54.5,1.4,53.1,0,51.5,0z M50,34.8H4.5
        V4.5H50V34.8z"></path><g
            ><rect fill="#37919b" x="29" y="26.5" width="12.1" height="4.2"></rect><g><path fill="#37919b" d="M13.4,13.5V8.7h19.1v4.8H26v17.2h-5.9V13.5H13.4z"></path></g></g
          ></g
        ></svg
      >
      <div>
        <a href="https://tutors.dev" target="_blank" rel="noopener noreferrer"><p class="pl-4">Powered by Tutors Course Reader {version}</p></a>
        <a href="https://github.com/tutors-sdk/tutors/commit/{sha}" target="_blank" rel="noopener noreferrer"><p class="pl-4 !text-xs">Last commit {id}</p></a>
      </div>
    </div>
    <a href="https://setu.ie" target="_blank" rel="noreferrer" class="btn mr-4 !rounded-md bg-[#435465] !py-2 !px-4">
      <img src="https://www.setu.ie/img/logos/setu-logo.svg" alt="South East Technological University" class="h-6" />
    </a>
    <a href="https://netlify.com" target="_blank" rel="noreferrer" class="ml-auto">
      <img src="https://www.netlify.com/v3/img/components/netlify-color-bg.svg" alt="Deploys by Netlify" class="h-10" />
    </a>
  </div>
</footer>
