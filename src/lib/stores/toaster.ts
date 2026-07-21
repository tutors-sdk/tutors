import { createToaster } from "@skeletonlabs/skeleton-svelte";

export const toaster = createToaster({
  placement: "top-end",
  overlap: true,
  gap: 16,
  duration: 8000
});
