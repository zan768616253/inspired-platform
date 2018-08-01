import decode from "jwt-decode";
import { browserHistory } from "react-router";
import Auth0Lock from "auth0-lock";
export const ID_TOKEN_KEY = "id_token";
const everified = "ev";
const userid = "uid";
let emailverified, picture, user_id;

import userstore from "./app/store/UserStore.js";

const lock = new Auth0Lock(
    "g0q1IC0FNMWQRnoT2KoRB6k4prFoKY4S",
    "inspireducation.auth0.com",
  {
    auth: {
      redirectUrl: `${window.location.origin}`,
      responseType: "token",
        scope: 'openid profile email'
    }
  }
);

lock.on("authenticated", authResult => {

    lock.getUserInfo(authResult.accessToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }
    localStorage.setItem("accessToken", authResult.accessToken)
    localStorage.setItem("profile", JSON.stringify(profile))
    userstore.obj = JSON.stringify(profile);

    user_id = profile["user_id"] = profile['sub']
    emailverified = profile["email_verified"]
    picture = profile["picture"];

    const providerInfos = profile.sub.split('|')

    const identities = [{
        connection: providerInfos[0],
        isSocial: true,
        user_id: providerInfos[1],
    }]

    profile.identities = identities

    localStorage.setItem("profile", JSON.stringify(profile));
    localStorage.setItem("ev", emailverified);
    localStorage.setItem("userid", user_id);

    // Update DOM
    if (emailverified) {
      browserHistory.push("/app")
      window.location.reload()
    } else {
      browserHistory.push("/verify")
    }
  });

  setIdToken(authResult.idToken);
});

export function logout() {
  clearIdToken();
  clearLocalStorage();
  browserHistory.replace("/")
  location.reload();
}

export function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    replace({ pathname: "/" });
  }
}

export function redirect(nextState, replace) {
  const email = localStorage.getItem("ev");
  if (isLoggedIn() && email) {
    replace({ pathname: "/app" })
    window.location.reload()
  }
}

function setIdToken(idToken) {
  localStorage.setItem(ID_TOKEN_KEY, idToken);
}

function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

function clearLocalStorage() {
  localStorage.removeItem(userid);
  localStorage.removeItem(everified);
}

function isLoggedIn() {
  const idToken = getIdToken();
  return !!idToken && !isTokenExpired(idToken);
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}
