<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  const redirectTo = `https://tutors.dev${$page.url.pathname}`;
  if (browser) window.location = redirectTo;
</script>

<pre>Redirecting to: {redirectTo} </pre>
