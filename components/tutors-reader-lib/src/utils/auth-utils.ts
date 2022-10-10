import Crypto from "crypto-es";
import type { User } from "../types/auth-types";

export function isAuthenticated() {
  if (!hasId()) {
    return false;
  }
  const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
  if (expiresAt) {
    return new Date().getTime() < expiresAt;
  }
  return false;
}

export function getUserId() {
  const user = fromLocalStorage();
  return user.userId;
}

export function hasId(): boolean {
  const id = localStorage.getItem("id");
  if (id) {
    return true;
  }
  return false;
}

export function toLocalStorage(user: User) {
  const id = encrypt(user.email);
  const info = encrypt(user.name);
  const picture = encrypt(user.picture);
  const nickname = encrypt(user.nickname);
  localStorage.setItem("id", id);
  localStorage.setItem("info", info);
  localStorage.setItem("infoextra", picture);
  localStorage.setItem("infoextraplus", nickname);
}

export function fromLocalStorage(): User {
  const id = localStorage.getItem("id");
  const user: User = {
    userId: localStorage.getItem("id"),
    email: decrypt(id),
    picture: decrypt(localStorage.getItem("infoextra")),
    name: decrypt(localStorage.getItem("info")),
    nickname: decrypt(localStorage.getItem("infoextraplus")),
    onlineStatus: "",
  };
  return user;
}

export function clearLocalStorage() {
  localStorage.removeItem("id");
  localStorage.removeItem("info");
  localStorage.removeItem("infoextra");
  localStorage.removeItem("infoextraplus");
  localStorage.removeItem("course_url");
  localStorage.removeItem("access_token");
  localStorage.removeItem("id_token");
  localStorage.removeItem("expires_at");
}

export function setSession(authResult: URLSearchParams) {
  const hour = 3600000;
  const expireAtTime = hour * 24 * 7 + new Date().getTime();
  const expiresAt = JSON.stringify(expireAtTime);
  localStorage.setItem("access_token", authResult.get("acces_token"));
  localStorage.setItem("id_token", authResult.get("id_token"));
  localStorage.setItem("expires_at", expiresAt);
}

export function getUserEmail() {
  const user = fromLocalStorage();
  return user.email;
}

export function logout() {
  clearLocalStorage();
}

const key = Crypto.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
const iv = Crypto.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");

export function encrypt(str: string): string {
  const ciphertext = Crypto.AES.encrypt(str, key, { iv: iv });
  const value = ciphertext.toString();
  return value;
}

export function decrypt(str: string): string {
  const raw = Crypto.AES.decrypt(str, key, { iv: iv });
  const value = raw.toString(Crypto.enc.Utf8);
  return value;
}
