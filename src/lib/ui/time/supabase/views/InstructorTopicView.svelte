<script lang="ts">
  import type { Course } from "$lib/services/models/lo-types";
  import TopicHeatMapChart from "./HeatMapChart.svelte";
  import type { Session } from "@supabase/supabase-js";

  export let course: Course;
  export let session: Session;
  export let userIds: string[];
  export let userNamesUseridsMap: Map<string, string>;
  export let multipleUsers: boolean = true;
</script>

<TopicHeatMapChart chartType="TopicHeatMap" {course} {session} {userIds} {userNamesUseridsMap} {multipleUsers} />
