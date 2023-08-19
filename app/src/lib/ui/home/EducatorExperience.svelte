<script lang="ts">
  import ExperienceCard from "./ExperienceCard.svelte";

  const icon = "mdi:teacher";
  const title = "Educator Experience";
  const link = "https://tutors.dev/course/tutors-reference-manual#tutors-values";
  const content = `
  The <strong><em>Educator Experience</em></strong> prioritises the creation of a
  <strong>guided paths</strong>
  through a curriculum via the creation of learning materials that are
	<strong>autonomous</strong>, <strong>structurally aligned</strong>,
	<strong>composable</strong>, <strong>auditable</strong>, <strong>extensible</strong>,
	<strong>versioned</strong>
	and <strong>independent</strong>.`;
</script>

<ExperienceCard {title} {icon} {link} {content} />
