<script lang="ts">
  import { onMount } from "svelte";
  import { clearLocalStorage, logout } from "tutors-reader-lib/src/utils/auth-utils";
  import { currentCourse, currentUser } from "tutors-reader-lib/src/stores/stores";
  onMount(() => {
    currentUser.set(null);
    currentCourse.set(null);
    clearLocalStorage();
    logout();
  });
</script>

<div class="container mx-auto mt-8 text-center">
  <div>You have been logged out of Tutors. Thanks for visiting!</div>
</div>
