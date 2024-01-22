<script lang="ts">
  import { page } from "$app/stores";
  import { currentCourse, currentLabStepIndex, currentLo } from "$lib/stores";
  import Icon from "../icons/Icon.svelte";

  let editRoute = $currentCourse.properties.github;

  let currentLabStep = "";
  let loRoute = "";
  currentLabStepIndex.subscribe((stepIndex) => {
    currentLabStep = String(stepIndex).padStart(2, "0") + ".";
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
      if ($currentLo.type == "lab") {
        const lastSegment = path.params.loid.substring(path.params.loid.lastIndexOf("/") + 1);
        if (lastSegment.startsWith("book")) {
        } else {
          loRoute = insertSubstringAfterLastSlash(path.params.loid, currentLabStep);
          loRoute = loRoute + ".md?plain=1";
        }
      } else if ($currentLo.type == "note") {
        loRoute = loRoute + "/note.md?plain=1";
      }
    }

    editRoute = `${$currentCourse.properties.github}/${loRoute}`;
  });
</script>

<a class="btn btn-sm" href={editRoute} target="_blank" title="Edit this course"> <Icon type="edit"></Icon> &nbsp;Edit this Page </a>
