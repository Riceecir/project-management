import { useHttp } from "plugins/request";
import { QueryKey, useMutation, useQuery } from "react-query";
import { SortProps } from "types";
import { Board } from "types/board";
import { cleanObject } from "utils";
import {
  useAddConfig,
  useDeleteConfig,
  useReorderBoardConfig,
  useReorderConfig,
} from "utils/use-optimistic-option";

/* project 列表 */
export const useBoards = (param?: Partial<Board>) => {
  const http = useHttp();

  return useQuery<Board[]>(["boards", cleanObject(param)], () =>
    http("kanbans", { data: param })
  );
};

/* 添加看板 */
export const useAddBoard = (queryKey: QueryKey) => {
  const http = useHttp();
  return useMutation((params: Partial<Board>) => {
    return http("kanbans", { data: params, method: "POST" });
  }, useAddConfig(queryKey));
};

/* 删除看板 */
export const useDeleteBoard = (queryKey: QueryKey) => {
  const http = useHttp();
  return useMutation(({ id }: { id: number }) => {
    return http(`kanbans/${id}`, { method: "DELETE" });
  }, useDeleteConfig(queryKey));
};

/* 排序看板 */
export const useReorderBoard = (queryKey: QueryKey) => {
  const http = useHttp();

  return useMutation((params: SortProps) => {
    return http("kanbans/reorder", {
      data: params,
      method: "POST",
    });
  }, useReorderBoardConfig(queryKey));
};
