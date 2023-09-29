<script lang="ts">
  import ExperienceCard from "./ExperienceCard.svelte";

  const title = "Developer Experience";
  const icon = "ant-design:code-outlined";
  const link = "https://tutors.dev/course/tutors-reference-manual#tutors-values";
  const content = `
  The **_Developer Experience_** prioritises the specification and implementation of **robust**, 
  **well documented**, **loosely coupled components & services**, integrated into a 
  **coherent toolkit** open to contributions from **diverse skill sets**.
  `;
</script>

<ExperienceCard {title} {icon} {link} {content} />
