import * as qs from "qs";
import * as auth from "auth-provide";
import { useAuth } from "context/auth-context";
import { useCallback } from "react";
const apiUrl = process.env.REACT_APP_API_URL;

/* extends: 继承类型 */
interface Config extends RequestInit {
  data?: object;
  token?: string;
}

/* http请求封装 */
export const http = async (
  endpoint: string,
  { data = {}, token = "", headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };

  /* 判断 method 设置请求参数 */
  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data);
  }

  return window.fetch(`${apiUrl}/${endpoint}`, config).then(async (res) => {
    if (res.status === 401) {
      await auth.logout();
      window.location.reload();
      return Promise.reject({ message: "请重新登录!" });
    }

    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};

export const useHttp = () => {
  const { user } = useAuth();

  /* Parameters typeof：typescript操作符 */
  return useCallback(
    (...[endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config, token: user?.token }),
    [user?.token]
  );
};

// export const useHttp = (...[endpoint, config]: Parameters<typeof http>) => {
//   const { user } = useAuth()

//   /* Parameters typeof：typescript操作符 */
//   return http(endpoint, { ...config, token: user?.token })
// }
