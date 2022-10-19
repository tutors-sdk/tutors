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

<div class="tooltip tooltip-top dropdown dropdown-end dropdown-hover flex-none">
  <Icon type="dark" toolTip="Change Visual Theme" button={true} />
  <ul class="menu dropdown-content bg-base-100 text-base-content w-52 rounded-lg p-1 shadow">
    {#each themes as theme}
      <button on:click={() => setTheme(theme)} class="bg-base-100 text-base-content py-2" data-theme={theme}>{theme}</button>
    {/each}
  </ul>
</div>
