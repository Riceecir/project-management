import { User } from "screens/project-list/search-panel";

const apiUrl = process.env.REACT_APP_API_URL;
const localStorageKey = "__auth_provide_token__";

export const getToken = () => window.localStorage.getItem(localStorageKey);

export const setToken = (token: string) =>
  window.localStorage.setItem(localStorageKey, token);

export const handleUserResponse = ({ user }: { user: User }) => {
  setToken(user.token || "");
};

export const login = (data: { username: string; password: string }) => {
  fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (res) => {
    if (res.ok) {
      return handleUserResponse(await res.json());
    }
  });
};

export const register = (data: { username: string; password: string }) => {
  fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (res) => {
    if (res.ok) {
      return handleUserResponse(await res.json());
    }
  });
};

export const logout = () => window.localStorage.removeItem(localStorageKey);
