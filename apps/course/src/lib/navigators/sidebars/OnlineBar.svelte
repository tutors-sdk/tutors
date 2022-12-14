<script lang="ts">
  import { onlineDrawer, studentsOnline2, studentsOnlineList2 } from "tutors-reader-lib/src/stores/stores";
  import { StudentCardDeck } from "tutors-ui";

  const drawerClose: any = () => {
    onlineDrawer.set(false);
  };
</script>

<div class="mt-4 mr-4 text-right">
  <button class="btn btn-icon bg-primary-500 text-white" on:click="{drawerClose}"><span class="font-bold">X</span></button>
</div>
<div class="px-12 py-4">
  <div class="flex flex-wrap">
    {#if $studentsOnline2 == 0}
      <span class="text-lg">No students currently online...</span>
    {/if}
    <div class="flex w-full flex-wrap justify-center">
      <StudentCardDeck />
    </div>
  </div>
</div>
