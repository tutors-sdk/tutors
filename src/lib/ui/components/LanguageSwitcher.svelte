<script lang="ts">
  import { setLocale } from '$lib/translations';

  function changeLanguage(lang: string) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('lang', lang);
    window.location.href = currentUrl.toString();
  }
</script>

<style>
  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    top: 0;
    left: 100%;
    background-color: white;
    padding: 5px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    white-space: nowrap; /* Ensure it doesn't wrap the text */
  }

  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: inline-block;
  }

  .dropdown-content a:hover {
    background-color: #f1f1f1;
  }

  .dropdown:hover .dropdown-content {
    display: flex;
    flex-direction: row; /* Arrange items horizontally */
  }

  .dropdown:hover .dropbtn {
    background-color: #3e8e41;
  }

  .dropbtn {
    padding: 12px;
    cursor: pointer;
  }
</style>

<div class="dropdown">
  <div class="dropbtn">Language</div>
  <div class="dropdown-content">
    <a on:click={() => changeLanguage('en')}>English</a>
    <a on:click={() => changeLanguage('fr')}>Français</a>
    <a on:click={() => changeLanguage('de')}>Deutsch</a>
    <a on:click={() => changeLanguage('it')}>Italiano</a>
    <a on:click={() => changeLanguage('es')}>Español</a>
  </div>
</div>
