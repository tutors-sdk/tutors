<script lang="ts">
  import type { Course } from "$lib/services/models/lo-types";
  import LabHeatMapChart from "./HeatMapChart.svelte";
  import type { Session } from "@supabase/supabase-js";

  export let course: Course;
  export let session: Session;
  export let userIds: string[];
  export let multipleUsers: boolean = false;
</script>

<LabHeatMapChart chartType="LabHeatMap" {course} {session} {userIds} {multipleUsers} />
