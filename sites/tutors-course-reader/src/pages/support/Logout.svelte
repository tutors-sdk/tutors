<script lang="ts">
  import { onMount } from "svelte";
  import { logout } from "tutors-reader-lib/src/utils/auth-utils";
  import { currentUser } from "../../stores";
  onMount(async () => {
    currentUser.set(null);
    logout();
  });
</script>

<div class="container mx-auto text-center mt-8">
  <div>You have been logged out of Tutors</div>
</div>
