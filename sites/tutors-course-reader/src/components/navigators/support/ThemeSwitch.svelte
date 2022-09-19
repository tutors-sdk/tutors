<script>
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import { setIconLib, themeIcons, themes } from "tutors-reader-lib/src/iconography/themes";

  const htmlTag = document.getElementsByTagName("html")[0];

  function setTheme(selectedTheme) {
    window.localStorage.setItem("site-theme", selectedTheme);
    window.localStorage.setItem("theme", selectedTheme);
    htmlTag.setAttribute("data-theme", selectedTheme);
    setIconLib(themeIcons[selectedTheme]);
    console.log("setting theme to ", selectedTheme);
  }
</script>

<div class="flex-none dropdown dropdown-end dropdown-hover">
  <Icon type="dark" button="true" />
  <ul class="shadow menu dropdown-content bg-base-100 text-base-content w-48 p-1 rounded-xl" tabindex="0">
    {#each themes as theme}
      <button on:click={() => setTheme(theme)} class="bg-base-100 text-base-content py-2" data-theme={theme}>{theme}</button>
    {/each}
  </ul>
</div>
