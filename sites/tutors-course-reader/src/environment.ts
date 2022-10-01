const clientId = import.meta.env.VITE_auth0_clientId;
const domain = import.meta.env.VITE_auth0_domain;
const redirectUri = import.meta.env.VITE_auth0_redirectUri;
const apiKey = import.meta.env.VITE_firebase_apiKey;
const databaseUrl = import.meta.env.VITE_firebase_databaseUrl;
const projectId = import.meta.env.VITE_firebase_projectId;

const keys = {
  auth0: {
    clientId: clientId,
    domain: domain,
    redirectUri: redirectUri,
  },
  firebase: {
    apiKey: apiKey,
    databaseURL: databaseUrl,
    projectId: projectId,
  },
};

export function getKeys() {
  return keys;
}
