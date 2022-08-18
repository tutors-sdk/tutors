import type { AnalyticsService } from "./analytics-service";
import { WebAuth } from "auth0-js";
import type { Course } from "tutors-reader-lib/src/models/course";
import { encrypt, fromLocalStorage, isAuthenticated, setSession, toLocalStorage } from "tutors-reader-lib/src/utils/auth-utils";
import { replace } from "svelte-spa-router";
import { getKeys } from "../../environment";

const auth0 = new WebAuth({
  domain: getKeys().auth0.domain,
  clientID: getKeys().auth0.clientId,
  redirectUri: getKeys().auth0.redirectUri,
  audience: `https://${getKeys().auth0.domain}/userinfo`,
  responseType: "token id_token",
  scope: "openid",
});

export function checkAuth(course: Course, loType: string, analytics: AnalyticsService) {
  let status = true;
  if (course.authLevel > 0) {
    if (!isAuthenticated()) {
      status = false;
      localStorage.setItem("course_url", course.url);
      login();
    } else {
      const user = fromLocalStorage();
      analytics.reportLogin(user, course.url);
    }
  }
  return status;
}

export function handleAuthentication(result: string, analytics: AnalyticsService): void {
  let authResult = new URLSearchParams(result);
  const accessToken = authResult.get("access_token");
  const idToken = authResult.get("id_token");
  if (accessToken && idToken) {
    auth0.client.userInfo(accessToken, function (err, user) {
      if (err) {
        console.log("Error loading the Profile", err);
      }
      toLocalStorage(user);
      const url = localStorage.getItem("course_url");
      user.userId = encrypt(user.email);
      analytics.reportLogin(user, url);
      setSession(authResult);
      replace(`/course/${url}`);
    });
  }
}

function login() {
  auth0.authorize({ prompt: "login", scope: "openid profile email" });
}
