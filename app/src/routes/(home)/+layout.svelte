<script>
  import { AppShell } from "@skeletonlabs/skeleton";
  import "iconify-icon";
</script>

<AppShell>
  <slot />

  <div class="bg-surface-100-800-token bottom-0 py-16">
    <footer class="mx-auto w-11/12 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-[auto_auto_auto_auto] gap-10">
        <div class="space-y-4">
          <div
            class="grid grid-cols-1 gap-2 place-content-center place-items-center md:place-items-start"
          >
            <div>
              <img src="/logo.svg" alt="Tutors Logo" />
              <p class="font-bold !text-lg mt-4">
                Tutors Open Source Project
                <br />Licensed under the
                <a
                  href="https://github.com/tutors-sdk/tutors/blob/main/LICENSE"
                  target="_blank"
                  class="link"
                  rel="noreferrer"
                  >MIT License
                </a>
              </p>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <h6 class="font-bold !text-lg">Community</h6>
          <ul class="space-y-2">
            <li>
              <a href="https://github.com/tutors-sdk/tutors" target="_blank" rel="noreferrer"
                >View GitHub</a
              >
            </li>
            <li>
              <a href="https://discord.tutors.dev" target="_blank" rel="noreferrer"
                >Join Discord Community</a
              >
            </li>
            <li>
              <a rel="noreferrer" href="https://fosstodon.org/@tutors" target="_blank"
                >Follow on Mastodon</a
              >
            </li>
            <li>
              <a href="https://twitter.com/tutors_dev" target="_blank" rel="noreferrer"
                >Follow on Twitter</a
              >
            </li>
          </ul>
        </div>
        <div class="space-y-4">
          <h6 class="font-bold !text-lg">Links</h6>
          <ul class="space-y-2">
            <li>
              <a href="https://tutors.dev/course/tutors-docs" target="_blank" rel="noreferrer"
                >Documentation</a
              >
            </li>
            <li>
              <a
                href="https://github.com/tutors-sdk/tutors/blob/main/CODE_OF_CONDUCT.md"
                target="_blank"
                rel="noreferrer">Code of Conduct</a
              >
            </li>
          </ul>
        </div>
        <div class="space-y-4">
          <h6 class="font-bold !text-lg">More</h6>
          <ul class="space-y-2">
            <li>
              <a href="https://www.netlify.com">
                <img
                  src="https://www.netlify.com/v3/img/components/netlify-color-bg.svg"
                  alt="Deploys by Netlify"
                  class="h-10"
                />
              </a>
            </li>
            <li>
              <a
                href="https://setu.ie"
                target="_blank"
                class="btn !rounded-md bg-[#435465] !py-2 !px-4"
                rel="noreferrer"
              >
                <img
                  src="https://www.setu.ie/img/logos/setu-logo.svg"
                  alt="South East Technological University"
                  class="h-6"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</AppShell>
