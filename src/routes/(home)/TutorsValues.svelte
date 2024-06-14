<script lang="ts">
  import DeveloperExperience from "./values/DeveloperExperience.svelte";
  import LearnerExperience from "./values/LearnerExperience.svelte";
  import EducatorExperience from "./values/EducatorExperience.svelte";
  import { t, locale } from '$lib/translations';

  let valuesTitle = '';

  $: valuesTitle = $t('common.valuesSection.title');
</script>

<div class="container py-5 mx-auto justify-center items-center">
  <div class="w-full m-4">
    <h2 class="font-bold !text-5xl inline-block">
      {@html valuesTitle}
    </h2>
  </div>
  <div class="w-full lg:flex justify-center my-12">
    <LearnerExperience />
    <EducatorExperience />
    <DeveloperExperience />
  </div>
</div>
