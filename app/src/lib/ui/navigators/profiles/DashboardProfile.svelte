<script lang="ts">
  import { popup } from "@skeletonlabs/skeleton";
  import DashboardProfileButton from "./DashboardProfileButton.svelte";
  import DashboardProfileMenu from "./DashboardProfileMenu.svelte";
  import type { Session } from "@supabase/supabase-js";
  export let session: Session;
  export let handleSignOut: () => void;
</script>

<button use:popup={{ event: "click", target: "avatar" }}>
  <DashboardProfileButton {session} />
</button>
<DashboardProfileMenu {session} {handleSignOut} />
