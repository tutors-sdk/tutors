<script lang="ts">
  import { Popover, Portal } from "@skeletonlabs/skeleton-svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { currentCourse } from "$lib/runes.svelte";

  const SENTIMENTS = [
    { id: "delighted", label: "Delighted" },
    { id: "confident", label: "Confident" },
    { id: "overwhelmed", label: "Overwhelmed" },
    { id: "confused", label: "Confused" },
    { id: "drained", label: "Drained" },
    { id: "exhausted", label: "Exhausted" }
  ] as const;

  type SentimentId = (typeof SENTIMENTS)[number]["id"];

  let menuOpen = $state(false);
  let selected = $state<SentimentId>("delighted");

  const storageKey = $derived(
    currentCourse.value?.courseId ? `tutors-course-sentiment:${currentCourse.value.courseId}` : null
  );

  $effect(() => {
    const key = storageKey;
    if (!key || typeof localStorage === "undefined") return;
    const raw = localStorage.getItem(key);
    if (raw && SENTIMENTS.some((s) => s.id === raw)) {
      selected = raw as SentimentId;
    } else {
      selected = "delighted";
    }
  });

  function pick(id: SentimentId) {
    selected = id;
    menuOpen = false;
    const key = storageKey;
    if (key) localStorage.setItem(key, id);
  }

  const selectedLabel = $derived(SENTIMENTS.find((s) => s.id === selected)?.label ?? "");
</script>

<Popover open={menuOpen} onOpenChange={(d) => (menuOpen = d.open)}>
  <Popover.Trigger
    class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary inline-flex items-center gap-2 rounded-lg p-2"
  >
    <Icon type={selected} tip={`How is the course going for you? — ${selectedLabel}.`} height="28" />
    <span class="hidden max-w-[7rem] truncate text-left text-sm font-bold lg:inline">{selectedLabel}</span>
  </Popover.Trigger>
  <Portal>
    <Popover.Positioner>
      <Popover.Content class="card bg-surface-50 z-999 m-2 max-w-[min(100vw-1rem,18rem)] shadow-lg dark:bg-surface-900">
        <Popover.Description>
          <div class="card-body gap-1 p-2">
            <p class="text-surface-600-400 px-2 text-xs font-semibold tracking-wide uppercase">Course mood</p>
            {#each SENTIMENTS as s (s.id)}
              <button
                type="button"
                class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left"
                onclick={() => pick(s.id)}
              >
                <span class="shrink-0"><Icon type={s.id} height="26" /></span>
                <span class="min-w-0 flex-1 text-sm font-medium">{s.label}</span>
                {#if selected === s.id}
                  <span class="text-success-500 shrink-0 text-lg leading-none" aria-hidden="true">✓</span>
                {/if}
              </button>
            {/each}
          </div>
        </Popover.Description>
      </Popover.Content>
    </Popover.Positioner>
  </Portal>
</Popover>
