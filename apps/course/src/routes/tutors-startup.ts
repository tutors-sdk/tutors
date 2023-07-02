import { page } from "$app/stores";
import { authService } from "tutors-reader-lib/src/services/auth-service";
import { get } from "svelte/store";
import { transitionKey, currentCourse, authenticating } from "tutors-reader-lib/src/stores/stores";
import { presenceService } from "tutors-reader-lib/src/services/presence-service";
import { initFirebase } from "tutors-reader-lib/src/utils/firebase-utils";
import { getKeys } from "../environment";
import { goto } from "$app/navigation";
import showdown from "showdown";
import showdownHighlight from "showdown-highlight";
import { showdownCopyCode } from "showdown-copy-code";
// import showdownKatex from "showdown-katex";
import customClassExt from "showdown-custom-class";
import { initConverter } from "tutors-reader-lib/src/utils/markdown-utils";

let converter: any;

function convertMdToHtml(md: string): string {
  return converter.makeHtml(md);
}

export function initMarkdownParser() {
  let showdownConverter = new showdown.Converter({
    tables: true,
    emoji: true,
    openLinksInNewWindow: true,
    extensions: [
      showdownHighlight,
      customClassExt,
      showdownCopyCode,
      // showdownKatex({
      //   // maybe you want katex to throwOnError
      //   throwOnError: true,
      //   // disable displayMode
      //   displayMode: true,
      //   // change errorColor to blue
      //   errorColor: "red"
      // })
    ]
  })
  converter = showdownConverter;
  initConverter(convertMdToHtml);
}

export async function initServices() {
  if (getKeys().firebase.apiKey !== "XXX") {
    initFirebase(getKeys().firebase);
    authService.setCredentials(getKeys().auth0);
    presenceService.startPresenceEngine();
    const pageVal = get(page);
    if (pageVal.url.hash) {
      if (pageVal.url.hash.startsWith("#/course")) {
        goto(pageVal.url.hash.slice(2));
      } else {
        authenticating.set(true);
        const token = pageVal.url.hash.substring(pageVal.url.hash.indexOf("#") + 1);
        authService.handleAuthentication(token, (courseId) => {
          goto(`/course/${courseId}`);
        });
      }
    } else {
      if (get(currentCourse)) {
        await authService.checkAuth(get(currentCourse));
      }
    }
  }

  page.subscribe((path) => {
    if (path.url.hash.startsWith("#/course")) {
      const relPath = path.url.hash.slice(1);
      goto(relPath);
    }
    transitionKey.set(path.url.pathname);
    if (path.url.pathname.includes("book") || path.url.pathname.includes("pdf") || path.url.pathname.includes("video")) {
      transitionKey.set("none");
    }
  });
}
