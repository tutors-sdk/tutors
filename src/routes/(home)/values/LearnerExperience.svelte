<script lang="ts">
  import ExperienceCard from "./ExperienceCard.svelte";
  import { t, locale } from '$lib/translations';

  let title = '';
  let content = '';

  $: {
    title = $t('common.learnerExperience.title');
    content = $t('common.learnerExperience.description');
    console.log('Title:', title);
    console.log('Content:', content);
  }

  const icon = "ph:student";
  const link = "https://tutors.dev/course/tutors-reference-manual#tutors-values";
</script>

<ExperienceCard {title} {icon} {link} {content} />
