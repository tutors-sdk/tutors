import { page } from "$app/stores";
import { analyticsService } from "$lib/services/analytics";
import { get } from "svelte/store";
import { transitionKey, currentCourse } from "$lib/stores";
import { initFirebase } from "$lib/services/utils/firebase";
import { getKeys } from "$lib/environment";
import { goto } from "$app/navigation";
import type { Token } from "$lib/services/types/auth";

export async function initServices(session: Token) {
  if (getKeys().firebase.apiKey !== "XXX") {
    initFirebase(getKeys().firebase);
    const pageVal = get(page);
    if (pageVal.url.hash) {
      if (pageVal.url.hash.startsWith("#/course")) {
        goto(pageVal.url.hash.slice(2));
      }
    } else {
      if (get(currentCourse)) {
        const course = get(currentCourse);
        if (session && course) {
          analyticsService.updateLogin(course.id, session);
        }
      }
    }
  }

  page.subscribe((path) => {
    transitionKey.set(path.url.pathname);
    if (
      path.url.pathname.includes("book") ||
      path.url.pathname.includes("pdf") ||
      path.url.pathname.includes("video") ||
      path.url.pathname.includes("note")
    ) {
      transitionKey.set("none");
    }
  });
}
