<script lang="ts">
  import { currentCourse, onlineStatus } from "$lib/stores";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
</script>

{#if $currentCourse.authLevel > 0 && $onlineStatus}
  <a href="/time/{$currentCourse?.courseUrl}" rel="noreferrer">
    <Icon icon="fluent:clock-alarm-24-filled" color="rgba(var(--color-primary-500))" height="20" tip={"This course is Tutors Time enabled"} />
  </a>
{/if}
