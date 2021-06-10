import { useHttp } from "plugins/request";
import { useQuery } from "react-query";
import { Task, TaskType } from "types/task";
import { cleanObject } from "utils";

/* task 列表 */
export const useTasks = (param?: Partial<Task>) => {
  const http = useHttp();

  return useQuery<Task[]>(["tasks", cleanObject(param)], () =>
    http("tasks", { data: param })
  );
};

/* task type列表 */
export const useTaskTypes = () => {
  const http = useHttp();

  return useQuery<TaskType[]>(["taskTypes"], () => http("taskTypes"));
};
