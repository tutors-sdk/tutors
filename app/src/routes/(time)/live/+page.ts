import { getKeys } from "$lib/environment";
import { fetchAllCourseAccess, initFirebase } from "$lib/services/utils/firebase";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  initFirebase(getKeys().firebase);
  return {
    allCourses: await fetchAllCourseAccess()
  };
};
