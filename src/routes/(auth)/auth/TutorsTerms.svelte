<script lang="ts">
  import { convertMdToHtml } from "@tutors/tutors-model-lib";
  import { t } from "$lib/services/i18n";
  import { sanitizeHtml } from "$lib/utils/sanitize";

  const content = $derived(convertMdToHtml(t("auth.terms")));
</script>

{@html sanitizeHtml(content ?? "")}
