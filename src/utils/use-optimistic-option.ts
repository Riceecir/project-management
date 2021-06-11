import { useQueryClient, QueryKey } from "react-query";
import { Task } from "types/task";
import { reorder } from "./reorder";

/* 乐观更新配置项 */
export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    onMutate: async (target: any) => {
      /* 获取缓存数据 */
      const previousItems = queryClient.getQueryData(queryKey);
      /* 设置修改后的数据 */
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old);
      });

      /* return 的值可以在 onError 第三个参数(context)取得 */
      return { previousItems };
    },
    onError: (error: any, newItem: any, ctx: any) => {
      queryClient.setQueryData(queryKey, ctx.previousItems);
    },
  };
};

/* delete：保留与target id 不同的值 */
export const useDeleteConfig = (queryKey: QueryKey) => {
  return useConfig(queryKey, (target: any, old?: any[]) => {
    return old?.filter((item) => item.id !== target.id) || [];
  });
};

/* edit：覆盖id相同项 */
export const useEditConfig = (queryKey: QueryKey) => {
  return useConfig(queryKey, (target: any, old?: any[]) => {
    return (
      old?.map((item) => {
        if (item.id === target.id) return { ...item, ...target };
        return item;
      }) || []
    );
  });
};

/* add：添加项 */
export const useAddConfig = (queryKey: QueryKey) => {
  return useConfig(queryKey, (target: any, old?: any[]) => {
    return old ? [...old, target] : [];
  });
};

/* reorder: 排序 */
export const useReorderConfig = (queryKey: QueryKey) => {
  return useConfig(queryKey, (target: any, old?: any[]) => old || []);
};

/* 看板排序乐观更新 */
export const useReorderBoardConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => reorder({ list: old, ...target }));

/* 任务排序 */
export const useReorderTaskConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    const orderedList = reorder({ list: old, ...target }) as Task[];
    return orderedList.map((item) =>
      item.id === target.fromId
        ? { ...item, kanbanId: target.toKanbanId }
        : item
    );
  });
