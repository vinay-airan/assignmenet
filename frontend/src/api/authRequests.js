import forgeClient from "./forgeClient";

export const requestLogin = (credentials) =>
  forgeClient.post("/auth/login", credentials);

export const requestSignup = (payload) =>
  forgeClient.post("/auth/signup", payload);

export const fetchCurrentUser = () =>
  forgeClient.get("/auth/me");
