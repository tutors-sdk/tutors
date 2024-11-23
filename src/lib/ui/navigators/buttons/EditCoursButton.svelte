<script lang="ts">
  import { page } from "$app/stores";
  import { currentCourse, currentLabStepIndex, currentLo } from "$lib/runes";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";

  let editRoute = $state(currentCourse?.value?.properties.github);

  let currentLabStep = "";
  let loRoute = "";

  $effect(() => {
    currentLabStep = String(currentLabStepIndex.value).padStart(2, "0") + ".";
  });

  function insertSubstringAfterLastSlash(originalString: string, substringToInsert: string) {
    const lastSlashIndex = originalString.lastIndexOf("/");

    if (lastSlashIndex !== -1) {
      const partBeforeSlash = originalString.slice(0, lastSlashIndex + 1);
      const partAfterSlash = originalString.slice(lastSlashIndex + 1);
      const modifiedString = partBeforeSlash + substringToInsert + partAfterSlash;
      return modifiedString;
    } else {
      // If no '/' is found, simply concatenate the substring to the original string
      return originalString + substringToInsert;
    }
  }

  page.subscribe((path) => {
    loRoute = "";
    if (path.params.loid) {
      loRoute = path.params.loid;
      if (currentLo?.value?.type == "lab") {
        const lastSegment = path.params.loid.substring(path.params.loid.lastIndexOf("/") + 1);
        if (lastSegment.startsWith("book")) {
        } else {
          loRoute = insertSubstringAfterLastSlash(path.params.loid, currentLabStep);
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
