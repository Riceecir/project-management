import { useProject } from "api/project";
import { useSetUrlQueryParam, useUrlQueryParam } from "./custom-hook";

/* Project state management */
export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);

  const [{ editProjectId }, setEditProjectId] = useUrlQueryParam([
    "editProjectId",
  ]);

  const setUrlParams = useSetUrlQueryParam();

  const { data: editingProject, isLoading } = useProject(Number(editProjectId));

  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => setUrlParams({ projectCreate: "", editProjectId: "" });
  const edit = (id: number) => setEditProjectId({ editProjectId: id });

  return {
    projectModalOpen: projectCreate === "true" || !!editProjectId,
    editingProject,
    isLoading,
    open,
    close,
    edit,
  };
};
