<script lang="ts">
  import { drawerStore } from "@skeletonlabs/skeleton";
  import { studentsOnline } from "tutors-reader-lib/src/stores/stores";
  import { StudentCardDeck } from "tutors-ui";

  const drawerClose: any = () => {
    drawerStore.close();
  };
</script>

<div class="mt-4 mr-4 text-right">
  <button class="btn btn-icon bg-primary-500 text-white" on:click="{drawerClose}"><span class="font-bold">X</span></button>
</div>
<div class="px-6 py-4">
  <div class="flex flex-wrap">
    {#if $studentsOnline == 0}
      <span class="text-lg">No students currently online...</span>
    {/if}
    <div class="flex w-full flex-wrap justify-center">
      <StudentCardDeck />
    </div>
  </div>
</div>
