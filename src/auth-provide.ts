import { User } from "screens/project-list/search-panel";

const apiUrl = process.env.REACT_APP_API_URL;
const localStorageKey = "__auth_provide_token__";

export const getToken = () => window.localStorage.getItem(localStorageKey);

export const setToken = (token: string) =>
  window.localStorage.setItem(localStorageKey, token);

export const handleUserResponse = ({ user }: { user: User }) => {
  setToken(user.token || "");
  return user;
};

export const login = async (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (res) => {
    if (res.ok) {
      return handleUserResponse(await res.json());
    } else {
      return Promise.reject(data);
    }
  });
};

export const register = async (data: {
  username: string;
  password: string;
}) => {
  return fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (res) => {
    if (res.ok) {
      return handleUserResponse(await res.json());
    } else {
      return Promise.reject(data);
    }
  });
};

export const logout = async () =>
  window.localStorage.removeItem(localStorageKey);
