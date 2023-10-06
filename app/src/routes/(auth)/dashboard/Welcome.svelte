<script lang="ts">
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
      <div class="grid grid-cols-2 gap-3">
        <div>
          <a class="btn btn-xl bg-primary-500 text-white font-bold hover:scale-105 transition-all w-60" href="/course/reference-course" target="_blank" rel="noreferrer"> Demo </a>
        </div>
        <div>
          <a class="btn btn-xl bg-surface-100-800-token font-bold hover:scale-105 transition-all w-60" href="/course/tutors-reference-manual" target="_blank" rel="noreferrer"
            >Documentation</a
          >
        </div>
        <div>
          <a class="btn btn-xl bg-surface-100-800-token font-bold hover:scale-105 transition-all w-60" href="/live" target="_blank" rel="noreferrer"> Live </a>
        </div>
        <div>
          <a class="btn btn-xl bg-primary-500 text-white font-bold hover:scale-105 transition-all w-60" href="/catalogue" target="_blank" rel="noreferrer">Catalogue</a>
        </div>
      </div>
    </div>
  </div>
</div>
