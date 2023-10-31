<script lang="ts">
  import ExperienceCard from "./ExperienceCard.svelte";

  const icon = "mdi:teacher";
  const title = "Educator Experience";
  const link = "https://tutors.dev/course/tutors-reference-manual#tutors-values";
  const content = `
  The **_Educator Experience_** prioritises the creation of a **guided paths** through a curriculum 
  via the creation of learning materials that are **autonomous**, **structurally aligned**, **composable**, 
  **auditable**, **extensible**, **versioned** and **independent**.
  `;
</script>

<ExperienceCard {title} {icon} {link} {content} />
