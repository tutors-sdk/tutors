<script lang="ts">
  import { goto } from "$app/navigation";
  import { currentCourse } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";

  let isSearching = sessionStorage.getItem("isSearching") === "true";
  let previousPage = "";

  const updateSearchState = () => {
    const currentPath = window.location.pathname;
    isSearching = currentPath.includes("/search/");
    sessionStorage.setItem("isSearching", isSearching.toString());
  };

  const toggleSearch = () => {
    if (isSearching) {
      goto(previousPage || "/course/" + currentCourse?.value?.courseId);
      sessionStorage.removeItem("isSearching");
    } else {
      previousPage = window.location.pathname;
      goto("/search/" + currentCourse?.value?.courseId);
      sessionStorage.setItem("isSearching", "true");
    }
    isSearching = !isSearching;
  };

  const checkForNavigation = () => {
    const currentPath = window.location.pathname;
    if (!currentPath.includes("/search/") && isSearching) {
      isSearching = false;
      sessionStorage.removeItem("isSearching");
    } else if (currentPath.includes("/search/")) {
      isSearching = true;
      sessionStorage.setItem("isSearching", "true");
    }
  };

  const observer = new MutationObserver(checkForNavigation);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.addEventListener("popstate", updateSearchState);
  updateSearchState();
</script>

<button on:click={toggleSearch}>
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary flex items-center gap-2 rounded-lg p-3 text-sm font-bold">
    <Icon type="search" tip="Search this course" />
    <span class="hidden lg:block"> {isSearching ? "Exit Search" : "Search"}</span>
  </div>
</button>
