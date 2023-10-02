<script lang="ts">
  import { page } from "$app/stores";
  const redirectTo = `https://tutors.dev${$page.url.pathname}`;
  window.location = redirectTo;
</script>

<pre> Redirecting to: {redirectTo} </pre>
