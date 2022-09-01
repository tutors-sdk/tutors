<script lang="ts">
  import type { StudentMetric, User } from "tutors-reader-lib/src/types/metrics-types";
  import { currentCourse, currentUser, studentsOnline } from "../../../stores";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import { getContext, onDestroy } from "svelte";
  import { isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";
  import { revealOnline } from "../../../stores";

  let user: User;
  let status = false;

  const metricsService = getContext("metrics");

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
  <div class="flex-none capitalize dropdown dropdown-end dropdown-hover">
    <div class="indicator">
      <span class="indicator-item indicator-top indicator-center badge badge-error">{$studentsOnline}</span>
      <button class="btn btn-ghost">
        {#if status}
          <Icon type="online" />
        {/if}
        {#if !status}
          <Icon type="offline" />
        {/if}
      </button>
    </div>
    <ul tabindex="0"
        class="shadow-xl menu dropdown-content bg-base-100 text-base-content w-48 p-1 rounded-box rounded-xl z-50">
      <li>
        <label class="cursor-pointer label"> <input type="checkbox" class="checkbox checkbox-primary checkbox-sm"
                                                    bind:checked={status} on:click={handleClick} /> <span
          class="label-text text-base-content text-base">Share Presence</span> </label>
      </li>
      <li>
        <button on:click={() => revealOnline.set(true)}>
          <div>View <span class="badge badge-success">{$studentsOnline}</span> Online</div>
        </button>
      </li>
    </ul>
  </div>
{/if}
