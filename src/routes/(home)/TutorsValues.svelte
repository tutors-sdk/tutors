<script lang="ts">
  import DeveloperExperience from "./values/DeveloperExperience.svelte";
  import LearnerExperience from "./values/LearnerExperience.svelte";
  import EducatorExperience from "./values/EducatorExperience.svelte";
</script>

<div class="container py-5 mx-auto justify-center items-center">
  <div class="w-full m-4">
    <h2 class="font-bold !text-5xl inline-block">
      The <span class="font-bold !text-5xl inline-block bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone">Values</span> of the
      project
    </h2>
  </div>
  <div class="w-full lg:flex justify-center my-12">
    <LearnerExperience />
    <EducatorExperience />
    <DeveloperExperience />
  </div>
</div>
