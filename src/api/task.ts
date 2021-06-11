import { useHttp } from "plugins/request";
import { QueryKey, useMutation, useQuery } from "react-query";
import { SortProps } from "types";
import { Task, TaskType } from "types/task";
import { cleanObject } from "utils";
import { useDebounce } from "utils/custom-hook";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
  useReorderConfig,
  useReorderTaskConfig,
} from "utils/use-optimistic-option";

/* task 列表 */
export const useTasks = (param?: Partial<Task>) => {
  const http = useHttp();
  const debounceParam = cleanObject({
    ...param,
    name: useDebounce(param?.name, 200),
  });

  return useQuery<Task[]>(["tasks", debounceParam], () =>
    http("tasks", { data: debounceParam })
  );
};

/* get task detail */
export const useTask = (id: number) => {
  const http = useHttp();
  return useQuery<Task>(["tasks", { id }], () => http(`tasks/${id}`), {
    enabled: !!id,
  });
};

/* 添加 task */
export const useAddTask = (queryKey: QueryKey) => {
  const http = useHttp();
  return useMutation((params: Partial<Task>) => {
    return http("tasks", { data: params, method: "POST" });
  }, useAddConfig(queryKey));
};

/* 更改项目信息 */
export const useEditTask = (queryKey: QueryKey) => {
  const http = useHttp();

  return useMutation(
    (params: Partial<Task>) =>
      http(`tasks/${params.id}`, { data: params, method: "PATCH" }),
    useEditConfig(queryKey)
  );
};

/* 删除任务 */
export const useDeleteTask = (queryKey: QueryKey) => {
  const http = useHttp();
  return useMutation(
    ({ id }: { id: number }) => http(`tasks/${id}`, { method: "DELETE" }),
    useDeleteConfig(queryKey)
  );
};

/* task type列表 */
export const useTaskTypes = () => {
  const http = useHttp();

  return useQuery<TaskType[]>(["taskTypes"], () => http("taskTypes"));
};

/* 排序 */
export const useReorderTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((params: SortProps) => {
    return client("tasks/reorder", {
      data: params,
      method: "POST",
    });
  }, useReorderTaskConfig(queryKey));
};
