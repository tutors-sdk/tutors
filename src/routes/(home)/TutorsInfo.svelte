<script lang="ts">
  import { t } from "$lib/services/i18n";
</script>

<h1 class="my-4 inline-block text-4xl! font-bold">
  {t("home.title")}{t("home.titleAn")}
  <span
    class="from-primary-500 to-secondary-500 inline-block bg-linear-to-br box-decoration-clone bg-clip-text text-4xl! font-bold text-transparent"
    >{t("home.openLearning")}
  </span>
  {t("home.webToolkit")}
</h1>
<p class="my-4 py-4 text-lg!">
  {t("home.description")} <a
    class="font-bold underline"
    href="https://www.setu.ie">{t("home.setu")}</a
  >{t("home.location")}
</p>
