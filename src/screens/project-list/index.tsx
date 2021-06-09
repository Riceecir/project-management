import React from "react";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useDebounce, useDocumentTitle } from "../../utils/custom-hook";
import styled from "@emotion/styled";
import { useProject } from "api/project";
import { Button, Row } from "antd";
import { useUser } from "api/user";
import { useProjectsSearchParams } from "./utils";
import { useProjectModal } from "utils/project";

export const ProjectList = () => {
  useDocumentTitle("项目列表");
  const { data: users } = useUser();
  const [param, setParam] = useProjectsSearchParams();
  const { open } = useProjectModal();

  const {
    isLoading,
    error,
    data: list,
    retry,
  } = useProject(useDebounce(param, 300));
  return (
    <Container>
      <Row justify={"space-between"}>
        <h1>项目列表</h1>
        <Button onClick={open}>创建项目</Button>
      </Row>
      <SearchPanel param={param} setParam={setParam} users={users || []} />
      {error ? <span>{error}</span> : ""}
      <List
        refresh={retry}
        loading={isLoading}
        dataSource={list || []}
        users={users || []}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
