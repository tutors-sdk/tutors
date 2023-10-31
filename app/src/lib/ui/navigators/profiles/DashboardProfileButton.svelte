<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton";
  import type { Session } from "@supabase/supabase-js";
  export let session: Session;
</script>

<button class="btn btn-sm space-x-1">
  <div class="relative inline-block">
    <Avatar width="w-10" src={session.user.user_metadata.avatar_url} alt={session.user.user_metadata.preferred_username} />
  </div>
</button>
