<script lang="ts">
  import type { User } from "tutors-reader-lib/src/types/metrics-types";
  import { currentCourse, currentUser, studentsOnline } from "../../../stores";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import { getContext } from "svelte";
  import { isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";
  import { revealOnline } from "../../../stores";
  import type { MetricsService } from "src/reader-lib/services/metrics-service";

  let user: User;
  let status = false;

  const metricsService = getContext<MetricsService>("metrics");

  function handleClick() {
    status = !status;
    metricsService.setOnlineStatus(user, status);
  }

  currentUser.subscribe(async (newUser) => {
    user = newUser;
    let course = await $currentCourse;
    if (isAuthenticated() && course.authLevel > 0) {
      if (user && !user.hasOwnProperty("onlineStatus")) {
        user.onlineStatus = "online";
      } else {
        if (user) status = user.onlineStatus === "online";
      }
    }
  });
</script>

{#if $currentUser && $currentCourse.authLevel > 0}
  <div class="dropdown dropdown-end dropdown-hover flex-none capitalize">
    <div class="indicator">
      <span class="badge indicator-item badge-error indicator-center indicator-top">{$studentsOnline}</span>
      <button class="btn btn-ghost">
        {#if status}
          <Icon type="online" />
        {/if}
        {#if !status}
          <Icon type="offline" />
        {/if}
      </button>
    </div>
    <ul tabindex="0" class="dropdown-content menu rounded-box bg-base-100 text-base-content z-50 w-48 rounded-xl p-1 shadow-xl">
      <li>
        <label class="label cursor-pointer">
          <input type="checkbox" class="checkbox checkbox-primary checkbox-sm" bind:checked={status} on:click={handleClick} />
          <span class="label-text text-base-content text-base">Share Presence</span>
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
  </div>
{/if}
