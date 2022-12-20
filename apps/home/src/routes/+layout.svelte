<script>
	import '/tutors.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import 'iconify-icon';
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<AppBar background="bg-surface-100-800-token" shadow="none" class="h-20">
			<svelte:fragment slot="lead">
				<div class="flex space-x-4">
					<img src="logo.svg" alt="tutors logo" />
					<span class="text-2xl font-bold">Tutors</span>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
				<a class="btn btn-icon hover:bg-primary-100-800-token hover:scale-105 transition-all" href="https://github.com/tutors-sdk/tutors" target="_blank" rel="noreferrer"><iconify-icon icon="mdi:github" height="25" /></a>
				<a class="btn btn-icon hover:bg-primary-100-800-token hover:scale-105 transition-all" href="https://fosstodon.org/@tutors" target="_blank" rel="noreferrer"><iconify-icon icon="mdi:mastodon" height="25" /></a>
				<a class="btn btn-icon hover:bg-primary-100-800-token hover:scale-105 transition-all" href="https://twitter.com/tutors_dev" target="_blank" rel="noreferrer"><iconify-icon icon="mdi:twitter" height="25" /></a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />

	<svelte:fragment slot="pageFooter">
        <div class="bg-surface-100-800-token bottom-0 py-16">
          <footer class="mx-auto w-11/12 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-[auto_auto_auto_auto] gap-10">
              <div class="space-y-4">
                <div
                  class="grid grid-cols-1 gap-2 place-content-center place-items-center md:place-items-start"
                >
                  <div>
                    <img src="/logo.svg" />
                    <p class="font-bold !text-xl mt-4">
                      Tutors Open Source Project
                      <br />Licensed under the <a
                        href="https://github.com/tutors-sdk/tutors/blob/main/LICENSE"
                        target="_blank"
                        class="link"
                        >MIT License
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <h6 class="font-bold !text-xl">Community</h6>
                <ul class="space-y-2">
                  <li>
                    <a href="https://github.com/tutors-sdk/tutors" target="_blank" rel="noreferrer"
                      >View GitHub</a
                    >
                  </li>
                  <li>
                    <a rel="me" href="https://fosstodon.org/@tutors" target="_blank"
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
                <h6 class="font-bold !text-xl">Links</h6>
                <ul class="space-y-2">
                  <li>
                    <a href="https://docs.tutors.dev" target="_blank" rel="noreferrer"
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
                <h6 class="font-bold !text-xl">More</h6>
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
      </svelte:fragment>
</AppShell>
