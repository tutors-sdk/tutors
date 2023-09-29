<script lang="ts">
  import ExperienceCard from "./ExperienceCard.svelte";

  const title = "Learner Experience";
  const icon = "ph:student";
  const link = "https://tutors.dev/course/tutors-reference-manual#tutors-values";
  const content = `
  he **_Learner Experience_** prioritises web interactions that are **engaging**, **contextual**, 
  **linkable**, **searchable**, **accessible** and **responsive**. In addition the experience 
  should foster a sense of **community** and **connection** among fellow learners.
`;
</script>

<ExperienceCard {title} {icon} {link} {content} />
