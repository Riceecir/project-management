import { useCallback, useEffect } from "react";
import { useHttp } from "plugins/request";
import { Project } from "screens/project-list/list";
import { useAsync } from "utils/custom-hook";
import { cleanObject } from "utils";
import { useQuery, useQueryClient, useMutation } from "react-query";

/* project 列表 */
export const useProjects = (param?: Partial<Project>) => {
  const http = useHttp();
  /* const { run, ...reslut } = useAsync<Project[]>();
  const fetchProjects = useCallback(
    () => http("projects", { data: cleanObject(param || {}) }),
    [http, param]
  );

  useEffect(() => {
    run(fetchProjects(), { retry: fetchProjects });
  }, [param, run, fetchProjects]);

  return reslut; */
  return useQuery<Project[]>(["projects", cleanObject(param || {})], () =>
    http("projects", { data: param })
  );
};

/* 更改项目信息 */
export const useEditProject = () => {
  const http = useHttp();
  /* const { run, ...asyncResult } = useAsync();
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
  }; */
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      http(`projects/${params.id}`, { data: params, method: "PATCH" }),
    {
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
  );
};

/* 添加项目 */
export const useAddProject = () => {
  const http = useHttp();
  /* const { run, ...asyncResult } = useAsync();
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
  }; */
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      http("projects", { data: params, method: "POST" }),
    {
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
  );
};

/* 查询project详情 */
export const useProject = (id?: number) => {
  const http = useHttp();
  return useQuery<Project>(["project", { id }], () => http(`projects/${id}`), {
    enabled: !!id,
  });
};
