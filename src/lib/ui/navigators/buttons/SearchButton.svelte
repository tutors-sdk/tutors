<script lang="ts">
  import { currentCourse } from "$lib/stores";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import { goto } from "$app/navigation";
  
  let isSearching = sessionStorage.getItem("isSearching") === "true";
  let previousPage = "";

  const updateSearchState = () => {
    const currentPath = window.location.pathname;
    isSearching = currentPath.includes("/search/");
    sessionStorage.setItem("isSearching", isSearching.toString());
  };

  const toggleSearch = () => {
    if (isSearching) {
      goto(previousPage || "/course/" + $currentCourse?.courseUrl); 
      sessionStorage.removeItem("isSearching");
    } else {
      previousPage = window.location.pathname;
      goto("/search/" + $currentCourse?.courseUrl);
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
    subtree: true,
  });

  window.addEventListener("popstate", updateSearchState);
  updateSearchState();
</script>

<button class="btn btn-sm" on:click={toggleSearch}>
  <span class="text-sm font-bold inline-flex gap-2">
    <Icon type="search" />
    <span class="hidden lg:block"> {isSearching ? "Exit Search" : "Search"}</span>
  </span>
</button>
