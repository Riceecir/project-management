import { User } from "types/user";

const apiUrl = process.env.REACT_APP_API_URL;
const localStorageKey = "__auth_provide_token__";

export const getToken = () => window.localStorage.getItem(localStorageKey);

export const setToken = (token: string) =>
  window.localStorage.setItem(localStorageKey, token);

export const handleUserResponse = ({ user }: { user: User }) => {
  setToken(user.token || "");
  return user;
};

/* 登录 */
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
      return Promise.reject(await res.json());
    }
  });
};

/* 注册 */
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
      return Promise.reject(await res.json());
    }
  });
};

export const logout = async () =>
  window.localStorage.removeItem(localStorageKey);
