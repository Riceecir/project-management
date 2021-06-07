import React from "react";
import { Popover, Typography, List, Divider } from "antd";
import { useProject } from "api/project";
import styled from "@emotion/styled";

/**
 * header "项目" pop over
 */
export const ProjectPopover = ({
  createProjectBtn,
}: {
  createProjectBtn: JSX.Element;
}) => {
  const { data: projects, isLoading } = useProject();
  const Content = (
    <ContentContaier>
      <Typography.Text type={"secondary"}>收藏项目</Typography.Text>
      <List>
        {projects
          ?.filter((item) => item.pin)
          .map((item) => (
            <List.Item>
              <List.Item.Meta title={item.name} />
            </List.Item>
          ))}
      </List>
      <Divider />
      {createProjectBtn}
    </ContentContaier>
  );

  return (
    <Popover placement={"bottom"} content={Content}>
      <span>项目</span>
    </Popover>
  );
};

const ContentContaier = styled.div`
  min-width: 24rem;
`;
