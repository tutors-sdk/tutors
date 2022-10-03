<script lang="ts">
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import DarkMode from "./ThemeSwitch.svelte";
  import Search from "./Search.svelte";
  import Compact from "./Compact.svelte";
</script>

<div class="dropdown dropdown-end">
  <button>
    <Icon type="appSettings" button={true} />
  </button>
  <ul tabindex="0" class="dropdown-content menu rounded-box z-50 block w-44 rounded-xl bg-base-100 p-1 text-base-content shadow-xl">
    <Search />
    <Compact />
    <DarkMode />
  </ul>
</div>
