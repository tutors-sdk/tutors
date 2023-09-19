<script lang="ts">
  import { NavigationPrimaryButton } from "$lib/components";
  import { currentCourse } from "$lib/stores";
</script>

<NavigationPrimaryButton href="/search/{$currentCourse?.courseUrl}" icon="fluent:search-24-filled" iconColour="rgba(var(--color-primary-500))" label="Search" />
