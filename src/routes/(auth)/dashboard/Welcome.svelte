<script lang="ts">
  import Links from "$lib/ui/navigators/Links.svelte";
  export let session: any;
</script>

<div class="bg-gradient-to-l from-primary-50 dark:from-primary-900 to-accent-50 dark:to-accent-900">
  <div class="container lg:flex mx-auto py-20 px-8 justify-between">
    <div class="">
      <p class="text-3xl font-bold">
        Welcome, {session.user.user_metadata.name !== undefined ? session.user.user_metadata.name : session.user.user_metadata.user_name}!
      </p>
    </div>
    <div>
      <Links/>
    </div>
  </div>
</div>
