<script lang="ts">
  import { currentCourse, onlineStatus } from "$lib/stores";
  import Icon from "$lib/ui/icons/Icon.svelte";
</script>

{#if $currentCourse.authLevel > 0 && $onlineStatus}
  <Icon icon="eos-icons:hourglass" tip={"This course is TutorsTime enabled"} color={"green"} />
{/if}
