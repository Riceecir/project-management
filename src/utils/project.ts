import { useUrlQueryParam } from "./custom-hook";

/* Project state management */
export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);

  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => setProjectCreate({ projectCreate: "" });

  return {
    projectModalOpen: projectCreate === "true",
    open,
    close,
  };
};
