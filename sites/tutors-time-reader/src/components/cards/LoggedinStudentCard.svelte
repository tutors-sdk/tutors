<script lang="ts">
  import { cardTransition } from "../animations";
  import { currentUser } from "../../stores";
  import type { User } from "tutors-reader-lib/src/types/metrics-types";
  let status = false;
  let user: User;

  currentUser.subscribe((newUser) => {
    user = newUser;
    status = user?.onlineStatus === "offline";
  });
</script>

{#if user}
  <div transition:cardTransition class="tutorscard border-info h-32 w-32">
    <div class="card-title text-base-content mb-1 text-xs">{user.name}</div>
    <figure class="flex justify-center">
      <img loading="lazy" class="h-20 object-scale-down p-1" src={user.picture} alt={user.nickname} />
    </figure>
  </div>
{/if}
