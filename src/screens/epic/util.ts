import { useProjectIdInUrl } from "screens/board/util";

export const useEpicsSearchParams = () => ({ projectId: useProjectIdInUrl() });

/* 传递给 react-query 的 query 参数 */
export const useEpicsQueryKey = () => ["epics", useEpicsSearchParams()];
