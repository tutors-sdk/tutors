<script lang="ts">
  import { page } from "$app/stores";
  const redirectTo = `https://tutors.dev${$page.url.pathname}`;
</script>

<h1>Redirect to: {redirectTo}</h1>
