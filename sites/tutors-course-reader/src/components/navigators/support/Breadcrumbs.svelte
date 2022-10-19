<script lang="ts">
  import { currentCourse, currentLo } from "../../../stores";
  import { Breadcrumb, Crumb } from '@brainandbones/skeleton';
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
    import { logout } from "tutors-reader-lib/src/utils/auth-utils";

  function crumbs(lo: Lo, los: Lo[]) {
    if (lo) {
      crumbs(lo.parentLo, los);
      if (!(lo.type === "unit" && lo.parentLo.type === "course")) {
        los.push(lo);
      }
    }
    return los;
  }

  function truncate(input: string) {
    if (input.length > 15) {
      return input.substring(0, 15) + "...";
    }
    return input;
  }
</script>
<div class="p-1 my-4 mx-8 overflow-hidden">
<Breadcrumb text="text-xs">
  {#if $currentCourse.lo.properties?.parent != null }
	<Crumb href='#/{$currentCourse.lo.properties?.parent}'>
		<svelte:fragment slot="lead"><Icon type="programHome" /></svelte:fragment>
	</Crumb>
  {/if}
  {#each crumbs($currentLo, []) as lo, i}
  <Crumb href="{lo.route}">
    <svelte:fragment slot="lead">
    <Icon type={lo.type} />
  </svelte:fragment>
  <span class="hidden lg:block">{truncate(lo.title)}</span>
  </Crumb>
  {/each}
</Breadcrumb>
</div>