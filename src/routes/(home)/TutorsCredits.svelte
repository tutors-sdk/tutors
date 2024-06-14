<script lang="ts">
  import { t, locale } from '$lib/translations';

  let title = '';
  let description = '';
  let viewSource = '';

  $: {
    title = $t('common.creditsSection.title');
    description = $t('common.creditsSection.description');
    viewSource = $t('common.creditsSection.viewSource');
  }
</script>

<div class="bg-gradient-to-l from-primary-50 dark:from-primary-900 to-accent-50 dark:to-accent-900">
  <div class="container lg:flex justify-center items-center mx-auto py-20">
    <div class="w-full px-4">
      <h1 class="font-bold !text-5xl inline-block my-4">
        {@html title}
      </h1>
      <p class="font-bold !text-lg my-4">
        {@html description}
      </p>
      <a href="https://github.com/tutors-sdk/tutors/graphs/contributors" target="_blank" rel="noreferrer">
        <img src="https://contrib.rocks/image?repo=tutors-sdk/tutors" alt="github contributors list" />
      </a>
      <div class="my-4">
        <a class="btn btn-xl bg-primary-500 text-white font-bold hover:scale-105 transition-all" href="https://github.com/tutors-sdk/tutors" target="_blank" rel="noreferrer">
          <iconify-icon icon="mdi:github" />&nbsp; {viewSource}
        </a>
      </div>
    </div>
  </div>
</div>
