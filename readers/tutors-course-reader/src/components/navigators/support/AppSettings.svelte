<script lang="ts">
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import DarkMode from "./ThemeSwitch.svelte";
  import Search from "./Search.svelte";
  import Compact from "./Compact.svelte";
</script>

<div class="dropdown dropdown-end">
  <button>
    <Icon type="appSettings" button="true" />
  </button>
  <ul tabindex="0" class="shadow-xl menu dropdown-content bg-base-100 text-base-content w-44 p-1 rounded-box rounded-xl z-50 block">
    <Search />
    <Compact />
    <DarkMode />
  </ul>
</div>
