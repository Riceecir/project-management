import { useCallback, useEffect } from "react";
import { useHttp } from "plugins/request";
import { Project } from "screens/project-list/list";
import { useAsync } from "utils/custom-hook";
import { cleanObject } from "utils";

/* project 列表 */
export const useProject = (param?: Partial<Project>) => {
  const http = useHttp();
  const { run, ...reslut } = useAsync<Project[]>();
  const fetchProjects = useCallback(
    () => http("projects", { data: cleanObject(param || {}) }),
    [http, param]
  );

  useEffect(() => {
    run(fetchProjects(), { retry: fetchProjects });
  }, [param, run, fetchProjects]);

  return reslut;
};

/* 更改项目信息 */
export const useEditProject = () => {
  const http = useHttp();
  const { run, ...asyncResult } = useAsync();
  const mutate = (params: Partial<Project>) => {
    return run(
      http(`projects/${params.id}`, {
        data: params,
        method: "PATCH",
      })
    );
  };

  return {
    mutate,
    ...asyncResult,
  };
};

/* 添加项目 */
export const useAddProject = () => {
  const http = useHttp();
  const { run, ...asyncResult } = useAsync();
  const mutate = (params: Partial<Project>) => {
    return run(
      http(`/projects/${params.id}`, {
        data: params,
        method: "POST",
      })
    );
  };

  return {
    mutate,
    ...asyncResult,
  };
};
