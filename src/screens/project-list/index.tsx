import React from "react";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useDebounce, useDocumentTitle } from "../../utils/custom-hook";
import styled from "@emotion/styled";
import { useProjects } from "api/project";
import { Button, Row } from "antd";
import { useUser } from "api/user";
import { useProjectsSearchParams } from "./utils";
import { useProjectModal } from "utils/project";
import { ErrorBox, ScreenContainer } from "components/lib";

const ProjectList = () => {
  useDocumentTitle("项目列表");
  const { data: users } = useUser();
  const [param, setParam] = useProjectsSearchParams();
  const { open } = useProjectModal();

  const {
    isLoading,
    error,
    data: list,
    // retry,
  } = useProjects(useDebounce(param, 300));

  return (
    <ScreenContainer>
      <Row justify={"space-between"}>
        <h1>项目列表</h1>
        <Button onClick={open}>创建项目</Button>
      </Row>
      <SearchPanel param={param} setParam={setParam} users={users || []} />
      <ErrorBox error={error} />
      <List
        // refresh={retry}
        loading={isLoading}
        dataSource={list || []}
        users={users || []}
      />
    </ScreenContainer>
  );
};

export default ProjectList;
