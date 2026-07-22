<script lang="ts">
  import { tourService } from "$lib/services/tour";
  import { t } from "$lib/services/i18n";
  import { prefersReducedMotion } from "$lib/services/a11y/reduced-motion.svelte";
  import { browser } from "$app/environment";
  import { afterNavigate } from "$app/navigation";
  import type { TourPlacement } from "$lib/services/tour";

  let targetRect = $state<DOMRect | null>(null);
  let nextButton: HTMLButtonElement | undefined = $state();
  let previousActiveElement: Element | null = null;

  interface TooltipPos {
    top: string;
    left: string;
  }

  function computeTooltipPosition(rect: DOMRect, placement: TourPlacement): TooltipPos {
    const gap = 12;
    const tooltipWidth = 320;
    const tooltipHeight = 160;
    let top: number;
    let left: number;

    switch (placement) {
      case "bottom":
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case "top":
        top = rect.top - tooltipHeight - gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - gap;
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + gap;
        break;
    }

    const pad = 16;
    left = Math.max(pad, Math.min(left, window.innerWidth - tooltipWidth - pad));
    top = Math.max(pad, Math.min(top, window.innerHeight - tooltipHeight - pad));

    return { top: `${top}px`, left: `${left}px` };
  }

  function updateTargetRect() {
    if (!tourService.isOpen.value || !browser) return;
    const step = tourService.currentStep;
    if (!step) return;
    const el = document.querySelector(step.target);
    if (el) {
      targetRect = el.getBoundingClientRect();
    } else {
      targetRect = null;
    }
  }

  $effect(() => {
    if (!tourService.isOpen.value) return;
    if (!previousActiveElement) {
      previousActiveElement = document.activeElement;
    }

    const step = tourService.currentStep;
    if (!step || !browser) return;

    const el = document.querySelector(step.target);
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion.value ? "auto" : "smooth", block: "nearest" });
      requestAnimationFrame(() => {
        targetRect = el.getBoundingClientRect();
        setTimeout(() => nextButton?.focus(), 50);
      });
    }

    const onResize = () => updateTargetRect();
    const onScroll = () => updateTargetRect();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  });

  $effect(() => {
    if (!tourService.isOpen.value && previousActiveElement) {
      (previousActiveElement as HTMLElement)?.focus?.();
      previousActiveElement = null;
    }
  });

  afterNavigate(() => {
    if (tourService.isOpen.value) {
      tourService.skip();
    }
  });

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      tourService.skip();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      tourService.next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      tourService.prev();
    }
  }
</script>

{#if tourService.isOpen.value && targetRect && tourService.currentStep}
  {@const step = tourService.currentStep}
  {@const pos = computeTooltipPosition(targetRect, step.placement)}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-[9999]"
    onkeydown={onKeydown}
    role="dialog"
    aria-modal="true"
    aria-label={t("tour.ariaLabel")}
    tabindex="-1"
  >
    <div
      class="absolute rounded-lg pointer-events-none"
      style="
        top: {targetRect.top - 6}px;
        left: {targetRect.left - 6}px;
        width: {targetRect.width + 12}px;
        height: {targetRect.height + 12}px;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
        transition: {prefersReducedMotion.value ? 'none' : 'all 0.3s ease'};
      "
    ></div>

    <button
      class="absolute inset-0 cursor-default"
      onclick={() => tourService.skip()}
      tabindex="-1"
      aria-label={t("tour.skip")}
    ></button>

    <div
      class="absolute z-10 w-80 rounded-xl bg-surface-100 dark:bg-surface-900 shadow-2xl"
      style="top: {pos.top}; left: {pos.left}; transition: {prefersReducedMotion.value ? 'none' : 'top 0.3s ease, left 0.3s ease'};"
    >
      <div class="p-4">
        <div role="status" aria-live="polite">
          <h3 class="text-sm font-bold mb-1">{t(step.titleKey)}</h3>
          <p class="text-sm text-surface-600 dark:text-surface-300 mb-4">{t(step.descriptionKey)}</p>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-xs text-surface-400">
            {tourService.currentStepIndex.value + 1} / {tourService.totalSteps}
          </span>
          <div class="flex gap-2">
            <button
              class="rounded-lg px-3 py-1.5 text-xs font-medium text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-700"
              onclick={() => tourService.skip()}
            >
              {t("tour.skip")}
            </button>
            {#if !tourService.isFirstStep}
              <button
                class="rounded-lg px-3 py-1.5 text-xs font-medium text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-700"
                onclick={() => tourService.prev()}
              >
                {t("tour.prev")}
              </button>
            {/if}
            <button
              bind:this={nextButton}
              class="rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-600"
              onclick={() => tourService.next()}
            >
              {tourService.isLastStep ? t("tour.finish") : t("tour.next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
