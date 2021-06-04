import React from "react";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useDebounce, useDocumentTitle } from "../../utils/custom-hook";
import styled from "@emotion/styled";
import { useProject } from "utils/project";
import { useUser } from "utils/user";
import { useProjectsSearchParams } from "./utils";

export const ProjectList = () => {
  useDocumentTitle("项目列表");
  const { data: users } = useUser();
  const [param, setParam] = useProjectsSearchParams();
  const { isLoading, error, data: list } = useProject(useDebounce(param, 300));
  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel param={param} setParam={setParam} users={users || []} />
      {error ? <span>{error}</span> : ""}
      <List loading={isLoading} dataSource={list || []} users={users || []} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
