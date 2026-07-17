<script lang="ts">
  import { t } from "$lib/services/i18n";
  const version = APP_VERSION;
</script>

<a href="https://tutors.dev" target="_blank" rel="noopener noreferrer">
  <p class="pl-4">
    {t("footer.version")}{version}
  </p>
</a>
