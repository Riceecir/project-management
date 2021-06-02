import { useEffect } from "react";
import { useHttp } from "plugins/request";
import { Project } from "screens/project-list/list";
import { useAsync } from "./custom-hook";
import { cleanObject } from "utils";

export const useProject = (param?: Partial<Project>) => {
  const http = useHttp();
  const { run, ...reslut } = useAsync<Project[]>();

  useEffect(() => {
    run(http("projects", { data: cleanObject(param || {}) }));
  }, [param]);

  return reslut;
};
