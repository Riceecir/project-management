import React from "react";
import { Popover, Typography, List, Divider } from "antd";
import { useProjects } from "api/project";
import styled from "@emotion/styled";
import { ButtonNoPadding } from "./lib";
import { useProjectModal } from "utils/project";

/**
 * header "项目" pop over
 */
export const ProjectPopover = () => {
  const { data: projects, refetch } = useProjects();
  const { open } = useProjectModal();

  const Content = (
    <ContentContaier>
      <Typography.Text type={"secondary"}>收藏项目</Typography.Text>
      <List>
        {projects
          ?.filter((item) => item.pin)
          .map((item) => (
            <List.Item key={item.id}>
              <List.Item.Meta title={item.name} />
            </List.Item>
          ))}
      </List>
      <Divider />
      <ButtonNoPadding type={"link"} onClick={open}>
        创建项目
      </ButtonNoPadding>
    </ContentContaier>
  );

  return (
    <Popover
      placement={"bottom"}
      content={Content}
      onVisibleChange={() => refetch}
    >
      <span>项目</span>
    </Popover>
  );
};

const ContentContaier = styled.div`
  min-width: 24rem;
`;
