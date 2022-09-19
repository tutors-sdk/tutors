// @ts-ignore
const clientId = import.meta.env.VITE_auth0_clientId
//@ts-ignore
const domain = import.meta.env.VITE_auth0_domain
// @ts-ignore
const redirectUri = import.meta.env.VITE_auth0_redirectUri
// @ts-ignore
const apiKey = import.meta.env.VITE_firebase_apiKey
// @ts-ignore
const databaseUrl = import.meta.env.VITE_firebase_databaseUrl
// @ts-ignore
const projectId = import.meta.env.VITE_firebase_projectId


let keys = {
  auth0: {
    clientId: clientId,
    domain: domain,
    redirectUri: redirectUri,
  },
  firebase: {
    apiKey: apiKey,
    databaseURL: databaseUrl,
    projectId: projectId,
  }
};

export function getKeys() {
  return keys;
}
