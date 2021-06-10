import { useProject } from "api/project";
import { useMemo } from "react";
import { useLocation } from "react-router";
import { useUrlQueryParam } from "utils/custom-hook";

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};

/* 根据 url id 获取 projects */
export const useProjectInUrl = () => useProject(useProjectIdInUrl());

export const useBoardSearchParams = () => {
  return { projectId: useProjectIdInUrl() };
};

/* 传递给 react-query 的 query 参数 */
export const useBoardQueryKey = () => ["boards", useBoardSearchParams()];

/* 根据 url id 获取 tasks, url query 和 params */
export const useTasksSearchParams = () => {
  const [params, setParams] = useUrlQueryParam([
    "name",
    "typeId",
    "processorId",
    "tagId",
  ]);
  const projectId = useProjectIdInUrl();

  return useMemo(() => {
    return {
      projectId,
      name: params.name,
      typeId: Number(params.typeId) || undefined,
      processorId: Number(params.processorId) || undefined,
      tagId: Number(params.tagId) || undefined,
    };
  }, [projectId, params]);
};

/* 传递给 react-query 的 query 参数 */
export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()];
