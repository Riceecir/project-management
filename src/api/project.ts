import { useCallback, useEffect } from "react";
import { useHttp } from "plugins/request";
import { Project } from "screens/project-list/list";
import { useAsync } from "utils/custom-hook";
import { cleanObject } from "utils";
import { useQuery, useQueryClient, useMutation, QueryKey } from "react-query";
import {
  useEditConfig,
  useAddConfig,
  useDeleteConfig,
} from "utils/use-optimistic-option";

/* project 列表 */
export const useProjects = (param?: Partial<Project>) => {
  const http = useHttp();

  return useQuery<Project[]>(["projects", cleanObject(param)], () =>
    http("projects", { data: param })
  );
  /* const { run, ...reslut } = useAsync<Project[]>();
  const fetchProjects = useCallback(
    () => http("projects", { data: cleanObject(param || {}) }),
    [http, param]
  );

  useEffect(() => {
    run(fetchProjects(), { retry: fetchProjects });
  }, [param, run, fetchProjects]);

  return reslut; */
};

/* 更改项目信息 */
export const useEditProject = (queryKey: QueryKey) => {
  const http = useHttp();

  return useMutation(
    (params: Partial<Project>) =>
      http(`projects/${params.id}`, { data: params, method: "PATCH" }),
    useEditConfig(queryKey)
  );

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
};

/* 添加项目 */
export const useAddProject = (queryKey: QueryKey) => {
  const http = useHttp();
  return useMutation((params: Partial<Project>) => {
    return http("projects", { data: params, method: "POST" });
  }, useAddConfig(queryKey));
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
};

/* 删除项目 */
export const useDeleteProject = (queryKey: QueryKey) => {
  const http = useHttp();
  return useMutation(({ id }: { id: number }) => {
    return http(`projects/${id}`, { method: "DELETE" });
  }, useDeleteConfig(queryKey));
};

/* 查询project详情 */
export const useProject = (id?: number) => {
  const http = useHttp();
  return useQuery<Project>(["project", { id }], () => http(`projects/${id}`), {
    enabled: !!id,
  });
};
