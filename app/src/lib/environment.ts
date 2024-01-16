const clientId = import.meta.env.VITE_auth0_clientId;
const domain = import.meta.env.VITE_auth0_domain;
const customdomain = import.meta.env.VITE_auth0_customdomain;
const redirectUri = import.meta.env.VITE_auth0_redirectUri;

import { VITE_PUBLIC_firebase_apiKey, VITE_PUBLIC_firebase_projectId, VITE_PUBLIC_firebase_databaseUrl, VITE_PUBLIC_tutors_store_id, VITE_PUBLIC_tutors_store_secret, VITE_PUBLIC_party_kit_main_room } from '$env/static/public';

const keys = {
  firebase: {
    apiKey: VITE_PUBLIC_firebase_apiKey,
    databaseURL: VITE_PUBLIC_firebase_databaseUrl,
    projectId: VITE_PUBLIC_firebase_projectId,
    tutorStoreId: VITE_PUBLIC_tutors_store_id,
    tutorStoreSecret: VITE_PUBLIC_tutors_store_secret,
  },
  partyKit: {
    mainRoom: VITE_PUBLIC_party_kit_main_room
  }
};

export function getKeys() {
  return keys;
}
