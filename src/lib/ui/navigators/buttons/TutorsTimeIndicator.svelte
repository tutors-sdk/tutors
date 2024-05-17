<script lang="ts">
  import { currentCourse, onlineStatus } from "$lib/stores";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
</script>

{#if $currentCourse.authLevel > 0 && $onlineStatus}
  <a href="/time/{$currentCourse?.courseUrl}" rel="noreferrer">
    <Icon type="tutorsTime" tip={"This course is Tutors Time enabled"} />
  </a>
{/if}
