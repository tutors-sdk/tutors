<script lang="ts" context="module">
    import type { PageMeta } from '@vitebook/client';
    export const __pageMeta: PageMeta = {
      title: 'Themes',
      description: 'The themes used in the Tutors project',
    };
  </script>
  
  <script>
    import { Variant } from '@vitebook/client';
    let themes = ["tutors", "tutors-dark", "tutors-black", "tutors-dyslexia", "tutors-wireframe"];
  </script>
  
  {#each themes as theme}
  <Variant name={theme} description="The {theme} theme.">
    <div class="w-full h-96 bg-base-100" data-theme={theme}>
      The current selected theme is {theme}
  </div>
  </Variant>
  {/each}