<script lang="ts">
  import { page } from "$app/stores";
  let redirectTo = `https://tutors.dev${$page.url.pathname}`;
  if ($page.url.hash) {
    redirectTo = `https://tutors.dev${$page.url.hash.slice(1)}`;
    window.location = redirectTo;
  }
</script>

<h1>Redirect to: {redirectTo}</h1>
