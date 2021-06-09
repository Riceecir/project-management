import { useCallback, useEffect } from "react";
import { useHttp } from "plugins/request";
import { Project } from "screens/project-list/list";
import { useAsync } from "utils/custom-hook";
import { cleanObject } from "utils";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useProjectsSearchParams } from "screens/project-list/utils";

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
  return useQuery<Project[]>(["projects", cleanObject(param)], () =>
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
  const [searchParams] = useProjectsSearchParams();
  /* useQuery 传入的 key 和 参数 */
  const queryKey = ["projects", searchParams];

  return useMutation(
    (params: Partial<Project>) =>
      http(`projects/${params.id}`, { data: params, method: "PATCH" }),
    {
      onSuccess: () => queryClient.invalidateQueries("projects"),
      onMutate: async (targe) => {
        /* 获取缓存数据 */
        const previousItems = queryClient.getQueryData(queryKey);
        /* 设置修改后的数据 */
        queryClient.setQueryData(queryKey, (old?: Project[]) => {
          return (
            old?.map((project) => {
              return project.id === targe.id
                ? { ...project, ...targe }
                : project;
            }) || []
          ); // 如果 old 传入非 Array 返回一个空数据
        });

        /* return 的值可以在 onError 第三个参数(context)取得 */
        return { previousItems };
      },
      onError: (error, newItem, ctx) => {
        queryClient.setQueryData(
          queryKey,
          (ctx as { previousItems: Project[] }).previousItems
        );
      },
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
