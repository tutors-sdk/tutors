<script lang="ts">
  import { onMount } from "svelte";
  import { logout } from "tutors-reader-lib/src/utils/auth-utils";
  import { currentUser } from "tutors-reader-lib/src/stores/stores";
  onMount(() => {
    currentUser.set(null);
    logout();
  });
</script>

<div class="container mx-auto mt-8 text-center">
  <div>You have been logged out of Tutors</div>
</div>
