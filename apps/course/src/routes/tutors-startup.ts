import { page } from "$app/stores";
import { authService } from "tutors-reader-lib/src/services/auth-service";
import { get } from "svelte/store";
import { transitionKey, currentCourse, authenticating } from "tutors-reader-lib/src/stores/stores";
import { presenceService } from "tutors-reader-lib/src/services/presence-service";
import { initFirebase } from "tutors-reader-lib/src/utils/firebase-utils";
import { getKeys } from "../environment";
import { goto } from "$app/navigation";

export async function initServices() {
  const apiKey = getKeys().firebase.apiKey;
  if (apiKey !== "XXX") {
    initFirebase(getKeys().firebase);
    authService.setCredentials(getKeys().auth0);
    presenceService.startPresenceEngine();
    const pageVal = get(page);
    const hash = pageVal.url.hash;
    if (hash) {
      if (hash.startsWith("#/course")) {
        goto(hash.slice(2));
      } else {
        authenticating.set(true);
        const token = hash.substring(hash.indexOf("#") + 1);
        authService.handleAuthentication(token, (courseId) => {
          goto(`/course/${courseId}`);
        });
      }
    } else {
      const current = get(currentCourse);
      if (current) {
        await authService.checkAuth(current);
      }
    }
  }

  page.subscribe((path) => {
    const hash = path.url.hash;
    if (hash.startsWith("#/course")) {
      goto(hash.slice(1));
    }
    transitionKey.set(path.url.pathname);
    if (path.url.pathname.includes("book") || path.url.pathname.includes("pdf") || path.url.pathname.includes("video")) {
      transitionKey.set("none");
    }
  });
}
