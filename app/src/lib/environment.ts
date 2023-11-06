const clientId = import.meta.env.VITE_auth0_clientId;
const domain = import.meta.env.VITE_auth0_domain;
const customdomain = import.meta.env.VITE_auth0_customdomain;
const redirectUri = import.meta.env.VITE_auth0_redirectUri;
const apiKey = import.meta.env.VITE_firebase_apiKey;
const databaseUrl = import.meta.env.VITE_firebase_databaseUrl;
const projectId = import.meta.env.VITE_firebase_projectId;
const tutorStoreId = import.meta.env.VITE_tutors_store_id;
const tutorStoreSecret = import.meta.env.VITE_tutors_store_secret;
const partyKitMainRoom = import.meta.env.VITE_party_kit_main_room;

const keys = {
  firebase: {
    apiKey: apiKey,
    databaseURL: databaseUrl,
    projectId: projectId,
    tutorStoreId: tutorStoreId,
    tutorStoreSecret: tutorStoreSecret
  },
  partyKit: {
    mainRoom: partyKitMainRoom
  }
};

export function getKeys() {
  return keys;
}
