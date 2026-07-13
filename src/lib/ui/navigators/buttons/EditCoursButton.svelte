<script lang="ts">
  import { page } from "$app/state";
  import { currentCourse, currentLabStepIndex, currentLo } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";

  let editRoute = $state(currentCourse?.value?.properties.github);

  let currentLabStep = "";

  $effect(() => {
    currentLabStep = String(currentLabStepIndex.value).padStart(2, "0") + ".";
  });

  function insertSubstringAfterLastSlash(originalString: string, substringToInsert: string) {
    const lastSlashIndex = originalString.lastIndexOf("/");
    if (lastSlashIndex !== -1) {
      return originalString.slice(0, lastSlashIndex + 1) + substringToInsert + originalString.slice(lastSlashIndex + 1);
    }
    return originalString + substringToInsert;
  }

  $effect(() => {
    let loRoute = "";
    if (page.params.loid) {
      loRoute = page.params.loid;
      if (currentLo?.value?.type == "lab") {
        const lastSegment = page.params.loid.substring(page.params.loid.lastIndexOf("/") + 1);
        if (!lastSegment.startsWith("book")) {
          loRoute = insertSubstringAfterLastSlash(page.params.loid, currentLabStep);
          loRoute = loRoute + ".md?plain=1";
        }
      } else if (currentLo?.value?.type == "note") {
        loRoute = loRoute + "/note.md?plain=1";
      }
    }
    editRoute = `${currentCourse?.value?.properties.github}/${loRoute}`;
  });
</script>

<div class="flex items-center">
  <Icon type="edit" link={editRoute} target="_blank" tip="Edit this course"></Icon>
</div>
