import { useHttp } from "plugins/request";
import { useAsync } from "utils/custom-hook";
import { useEffect } from "react";
import { cleanObject } from "utils";
import { useQuery } from "react-query";
import { User } from "types/user";

/* 获取负责人列表 */
export const useUser = (param?: Partial<User>) => {
  const http = useHttp();
  return useQuery<User[]>(["users", cleanObject(param)], () =>
    http("users", { data: cleanObject(param) })
  );
  /* const { run, ...result } = useAsync<User[]>();

  useEffect(() => {
    run(http("users", { data: cleanObject(param) }));
  }, [param, http, run]);

  return result; */
};
