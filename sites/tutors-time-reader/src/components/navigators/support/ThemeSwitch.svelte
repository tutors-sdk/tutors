<script>
  import Icon from "tutors-ui/lib/Atoms/Iconography/Icon.svelte";
  import { setIconLib, themeIcons, themes } from "tutors-ui/lib/Atoms/Iconography/themes";

  const htmlTag = document.getElementsByTagName("html")[0];

  function setTheme(selectedTheme) {
    window.localStorage.setItem("site-theme", selectedTheme);
    window.localStorage.setItem("theme", selectedTheme);
    htmlTag.setAttribute("data-theme", selectedTheme);
    setIconLib(themeIcons[selectedTheme]);
    console.log("setting theme to ", selectedTheme);
  }
</script>

<div class="tooltip-top dropdown-end dropdown-hover dropdown tooltip flex-none">
  <Icon type="dark" toolTip="Change Visual Theme" button={true} />
  <ul class="dropdown-content menu w-52 rounded-lg bg-base-100 p-1 text-base-content shadow">
    {#each themes as theme}
      <button on:click={() => setTheme(theme)} class="bg-base-100 py-2 text-base-content" data-theme={theme}>{theme}</button>
    {/each}
  </ul>
</div>
