import React from "react";
import { Drawer } from "antd";
import { useProjectModal } from "utils/project";

export const ProjectModal = () => {
  const { projectModalOpen, close } = useProjectModal();
  return <Drawer visible={projectModalOpen} onClose={close} width="100%" />;
};
