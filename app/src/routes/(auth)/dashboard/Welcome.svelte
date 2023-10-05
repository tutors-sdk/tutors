<script lang="ts">
  export let session: any;
</script>

<div class="bg-gradient-to-l from-primary-50 dark:from-primary-900 to-accent-50 dark:to-accent-900">
  <div class="container lg:flex mx-auto py-24 px-8">
    <p class="text-3xl font-bold">
      Welcome, {session.user.user_metadata.name !== undefined ? session.user.user_metadata.name : session.user.user_metadata.user_name}!
    </p>
  </div>
</div>
