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
  <ul tabindex="0" class="menu dropdown-content bg-base-100 text-base-content rounded-box z-50 block w-44 rounded-xl p-1 shadow-xl">
    <Search />
    <Compact />
    <DarkMode />
  </ul>
</div>
