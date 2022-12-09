<script lang="ts">
  import { currentCourse, currentUser } from "tutors-reader-lib/src/stores/stores";
  import Icon from "../../Atoms/Icon/Icon.svelte";
  import { menu, Avatar, Divider } from "@skeletonlabs/skeleton";
  let gitUrl = "";
</script>

{#if $currentUser && $currentCourse.authLevel > 0}
  <div class="relative">
    <button class="btn btn-sm space-x-1" use:menu="{{ menu: 'avatar', interactive: true }}">
      <div class="relative inline-block">
        <Avatar width="w-10" src="{$currentUser.picture}" alt="{$currentUser?.nickname}" />
      </div>
    </button>
    <nav class="list-nav card card-body w-56 space-y-4 shadow-lg" data-menu="avatar">
      <span class="mt-2 ml-4 text-xs">Logged in as:</span><br />
      <span class="ml-4 text-sm">{$currentUser.name}</span>
      <Divider />
      <ul>
        <li>
          <a href="{gitUrl}" target="_blank" rel="noreferrer">
            <Icon type="github" />
            <div class="ml-2">Github Profile</div>
          </a>
        </li>
      </ul>
    </nav>
  </div>
{/if}
