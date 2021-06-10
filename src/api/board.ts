import { useHttp } from "plugins/request";
import { useQuery } from "react-query";
import { Board } from "types/board";
import { cleanObject } from "utils";

/* project 列表 */
export const useBoards = (param?: Partial<Board>) => {
  const http = useHttp();

  return useQuery<Board[]>(["kanbans", cleanObject(param)], () =>
    http("kanbans", { data: param })
  );
};
