<script lang="ts">
  import { currentCourse } from "$lib/stores";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
</script>

<a class="btn btn-sm" href="/search/{$currentCourse?.courseUrl}">
  <span class="text-sm font-bold inline-flex gap-2">
    <Icon icon="fluent:search-24-filled" color="rgba(var(--color-primary-500))" height="20" />
    <span class="hidden lg:block"> Search</span>
  </span>
</a>
