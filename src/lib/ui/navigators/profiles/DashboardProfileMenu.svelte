<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { Session } from "@supabase/auth-js/src/lib/types";
  export let session: Session;
  export let handleSignOut: () => void;
</script>

<nav class="list-nav card card-body w-56 p-4 space-y-4 shadow-lg" data-popup="avatar">
  <span class="mt-2 ml-4 text-xs">Logged in as:</span><br />
  <span class="ml-4 text-sm">{session.user.user_metadata.name !== undefined ? session.user.user_metadata.name : session.user.user_metadata.user_name}</span>
  <ul>
    <li>
      <a href="/dashboard">
        <Icon icon="fluent:home-24-filled" color="rgba(var(--color-primary-500))" height="20" />
        <div class="ml-2">Dashboard</div>
      </a>
    </li>
    <li>
      <a href="https://github.com/{session.user.user_metadata.preferred_username}" target="_blank" rel="noreferrer">
        <Icon icon="mdi:github" height="20" />
        <div class="ml-2">Github Profile</div>
      </a>
    </li>
    <li>
      <button on:click={handleSignOut} class="w-full">
        <Icon icon="fluent:sign-out-24-filled" color="rgba(var(--color-error-500))" height="20" />
        <div class="ml-2">Logout</div>
      </button>
    </li>
  </ul>
</nav>
