import React from "react";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useDebounce, useDocumentTitle } from "../../utils/custom-hook";
import styled from "@emotion/styled";
import { useProject } from "api/project";
import { useUser } from "api/user";
import { useProjectsSearchParams } from "./utils";
import { Button, Row } from "antd";

export const ProjectList = ({
  createProjectBtn,
}: {
  createProjectBtn: JSX.Element;
}) => {
  useDocumentTitle("项目列表");
  const { data: users } = useUser();
  const [param, setParam] = useProjectsSearchParams();
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
        {createProjectBtn}
      </Row>
      <SearchPanel param={param} setParam={setParam} users={users || []} />
      {error ? <span>{error}</span> : ""}
      <List
        refresh={retry}
        loading={isLoading}
        dataSource={list || []}
        users={users || []}
        createProjectBtn={createProjectBtn}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
