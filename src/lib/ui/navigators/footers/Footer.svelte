<script lang="ts">
  import SetuIcon from "$lib/ui/icons/themes/SetuIcon.svelte";
  import TutorsIcon from "$lib/ui/icons/themes/TutorsIcon.svelte";
  import TutorsVersion from "./TutorsVersion.svelte";
</script>

<div class="bg-surface-100-800-token border-t-[1px] border-surface-200-700-token bottom-0 mt-2">
  <div class="mx-auto w-11/12 py-4">
    <div class="flex grid-flow-col items-center">
      <div class="inline-flex flex-1">
        <TutorsIcon />
        <div>
          <TutorsVersion />
        </div>
      </div>
      <SetuIcon />
    </div>
  </div>
</div>
