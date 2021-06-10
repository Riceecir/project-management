import { useProject } from "api/project";
import { useTask } from "api/task";
import { useCallback, useMemo } from "react";
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
  const [params] = useUrlQueryParam(["name", "typeId", "processorId", "tagId"]);
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

/* task edit modal status */
export const useTaskModal = () => {
  const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam([
    "editingTaskId",
  ]);
  const { data: editingTask, isLoading } = useTask(Number(editingTaskId));
  /* 开启编辑 */
  const edit = useCallback(
    (id: number) => {
      setEditingTaskId({ editingTaskId: id });
    },
    [setEditingTaskId]
  );
  /* 关闭 */
  const close = useCallback(() => {
    setEditingTaskId({ editingTaskId: "" });
  }, [setEditingTaskId]);

  return {
    editingTaskId,
    editingTask,
    isLoading,
    close,
    edit,
  };
};
