<script lang="ts">
  import type { User } from "tutors-reader-lib/src/types/metrics-types";
  import { currentCourse, currentUser, studentsOnline } from "../../../stores";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import { getContext } from "svelte";
  import { isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";
  import { revealOnline } from "../../../stores";
  import type { MetricsService } from "src/reader-lib/services/metrics-service";
  import { menu } from "@brainandbones/skeleton";

  let user: User;
  let status = false;

  const metricsService: MetricsService = getContext("metrics");

  function handleClick() {
    status = !status;
    metricsService.setOnlineStatus(user, status);
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  currentUser.subscribe(async (newUser) => {
    user = newUser;
    let course = await $currentCourse;
    if (isAuthenticated() && course.authLevel > 0) {
      // eslint-disable-next-line no-prototype-builtins
      if (user && !user.hasOwnProperty("onlineStatus")) {
        user.onlineStatus = "online";
      } else {
        if (user) status = user.onlineStatus === "online";
      }
    }
  });
</script>

{#if $currentUser && $currentCourse.authLevel > 0}
<div class="relative">
  <button class="btn btn-sm space-x-1" use:menu={{ menu: 'presence' }}>
    {#if status}
          <Icon type="online" />
        {/if}
        {#if !status}
          <Icon type="offline" />
        {/if}
  </button>
  <nav class="list-nav card card-body w-56 shadow-xl space-y-4" data-menu="presence">
    <ul>
      <li class="inline-block">
        <label class="label cursor-pointer">
          <input type="checkbox" class="checkbox checkbox-primary checkbox-sm" bind:checked={status} on:click={handleClick} />
          <span class="label-text text-base text-base-content">Share Presence</span>
        </label>
      </li>
      {#if status}
        <li>
          <button on:click={() => revealOnline.set(true)}>
            <div>View <span class="badge badge-success">{$studentsOnline}</span> Online</div>
          </button>
        </li>
      {/if}
    </ul>
  </nav>
</div>
{/if}
