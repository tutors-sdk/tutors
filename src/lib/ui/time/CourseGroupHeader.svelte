<script lang="ts">
  import Icon from "../components/Icon.svelte";
  interface Props {
    courseId: string;
    courseTitle: string;
  }
  let { courseId, courseTitle }: Props = $props();
</script>

<div class="flex w-full justify-between pb-2">
  <h2 class="p-2 text-base font-semibold">
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="/course/{courseId}"
      class="text-primary hover:text-primary-dark inline-flex items-center gap-1 underline underline-offset-2 transition-colors hover:decoration-primary"
    >
      <Icon type="course" height="20" /><span>{courseTitle}</span>
    </a>
  </h2>
  <h2 class="p-2 text-base font-semibold">
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="/live/{courseId}"
      class="text-primary hover:text-primary-dark inline-flex items-center gap-1 underline underline-offset-2 transition-colors hover:decoration-primary"
    >
      <Icon type="live" height="20" /><span>Live Stream</span>
    </a>
  </h2>
</div>
