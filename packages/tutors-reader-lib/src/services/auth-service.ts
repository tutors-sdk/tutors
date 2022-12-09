import { analyticsService } from "./analytics-service";
import { currentUser } from "./../stores/stores";
import { WebAuth } from "auth0-js";
import type { Course } from "../models/course";
import { encrypt, fromLocalStorage, isAuthenticated, setSession, toLocalStorage } from "../utils/auth-utils";

export const authService = {
  auth0: {},

  setCredentials(credentials: any) {
    this.auth0 = new WebAuth({
      domain: credentials.domain,
      clientID: credentials.clientId,
      redirectUri: credentials.redirectUri,
      audience: `https://${credentials.domain}/userinfo`,
      responseType: "token id_token",
      scope: "openid"
    });
  },

  async loadUser(course: Course) {
    const user = fromLocalStorage();
    user.onlineStatus = await analyticsService.getOnlineStatus(course, user);
    currentUser.set(user);
  },

  async checkAuth(course: Course) {
    let status = true;
    if (course.authLevel > 0) {
      if (!isAuthenticated()) {
        status = false;
        localStorage.setItem("course_url", course.url);
        this.login(this.auth0);
      } else {
        this.loadUser(course);
      }
    }
    return status;
  },

  handleAuthentication(result: string, router: any): void {
    const authResult = new URLSearchParams(result);
    const accessToken = authResult.get("access_token");
    const idToken = authResult.get("id_token");
    if (accessToken && idToken) {
      this.auth0.client.userInfo(accessToken, function (err: any, user: any) {
        if (err) {
          console.log("Error loading the Profile", err);
        }
        toLocalStorage(user);
        const url = localStorage.getItem("course_url");
        user.userId = encrypt(user.email);
        setSession(authResult);
        router(`/course/${url}`);
      });
    }
  },

  login(auth0) {
    auth0.authorize({ prompt: "login", scope: "openid profile email" });
  }
};
