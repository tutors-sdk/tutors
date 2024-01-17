const clientId = import.meta.env.VITE_auth0_clientId;
const domain = import.meta.env.VITE_auth0_domain;
const customdomain = import.meta.env.VITE_auth0_customdomain;
const redirectUri = import.meta.env.VITE_auth0_redirectUri;

import { PUBLIC_firebase_apiKey, PUBLIC_firebase_projectId, PUBLIC_firebase_databaseUrl, PUBLIC_tutors_store_id, PUBLIC_tutors_store_secret, PUBLIC_party_kit_main_room } from '$env/static/public';

const keys = {
  firebase: {
    apiKey: PUBLIC_firebase_apiKey,
    databaseURL: PUBLIC_firebase_databaseUrl,
    projectId: PUBLIC_firebase_projectId,
    tutorStoreId: PUBLIC_tutors_store_id,
    tutorStoreSecret: PUBLIC_tutors_store_secret,
  },
  partyKit: {
    mainRoom: PUBLIC_party_kit_main_room
  }
};

export function getKeys() {
  return keys;
}
