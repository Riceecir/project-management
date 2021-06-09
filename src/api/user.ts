import { User } from "screens/project-list/search-panel";
import { useHttp } from "plugins/request";
import { useAsync } from "utils/custom-hook";
import { useEffect } from "react";
import { cleanObject } from "utils";

/* 获取负责人列表 */
export const useUser = (param?: Partial<User>) => {
  const http = useHttp();
  const { run, ...result } = useAsync<User[]>();

  useEffect(() => {
    run(http("users", { data: cleanObject(param) }));
  }, [param, http, run]);

  return result;
};
