import { useMemo } from "react";
import { useUrlQueryParam } from "utils/custom-hook";

export const useProjectsSearchParams = () => {
  const [params, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({ ...params, personId: Number(params.personId) || undefined }),
      [params]
    ),
    setParam,
  ] as const;
};
