<script lang="ts">
  import { cardTransition } from "../animations";
  import { currentUser } from "../../stores";
  import type { User } from "tutors-reader-lib/src/types/metrics-types";
  let status = false;
  let user: User;

  currentUser.subscribe(async newUser => {
    user = newUser;
    status = user?.onlineStatus === "offline";
  });
</script>

{#if user}
  <div transition:cardTransition class="tutorscard w-32 h-32 border-info">
    <div class="card-title text-base-content text-xs mb-1"> {user.name}</div>
    <figure class="flex justify-center">
      <img loading="lazy" class="object-scale-down p-1 h-20" src="{user.picture}" alt="{user.nickname}">
    </figure>
  </div>
{/if}
