import type { PageLoad } from "./$types";

import { getKeys } from "../../environment";
import { initFirebase } from "tutors-reader-lib/src/utils/firebase-utils";

import { fetchAllCourseAccess } from "tutors-reader-lib/src/utils/firebase-utils";

export const load: PageLoad = async ({ params }) => {
  initFirebase(getKeys().firebase);
  return {
    allCourses: await fetchAllCourseAccess()
  };
};
