<script lang="ts">
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import Compact from "./Compact.svelte";
</script>

<div class="dropdown dropdown-end">
  <button>
    <Icon type="appSettings" button={true} />
  </button>
  <ul tabindex="0" class="dropdown-content menu rounded-box bg-base-100 text-base-content z-50 block w-44 rounded-xl p-1 shadow-xl">
    <Compact />
  </ul>
</div>
