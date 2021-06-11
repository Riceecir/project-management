import { useHttp } from "plugins/request";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Epic } from "types/epic";
import { cleanObject } from "utils";
import { useAddConfig, useDeleteConfig } from "utils/use-optimistic-option";

/* 任务组列表 */
export const useEpics = (param?: Partial<Epic>) => {
  const http = useHttp();

  return useQuery<Epic[]>(["epics", cleanObject(param)], () =>
    http("epics", { data: param })
  );
};

/* 添加任务组 */
export const useAddEpic = (queryKey: QueryKey) => {
  const http = useHttp();
  return useMutation((params: Partial<Epic>) => {
    return http("epics", { data: params, method: "POST" });
  }, useAddConfig(queryKey));
};

/* 删除任务组 */
export const useDeleteEpic = (queryKey: QueryKey) => {
  const http = useHttp();
  return useMutation(({ id }: { id: number }) => {
    return http(`epics/${id}`, { method: "DELETE" });
  }, useDeleteConfig(queryKey));
};
