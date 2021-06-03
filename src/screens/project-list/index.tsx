import React, { useState } from "react";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useDebounce } from "../../utils/custom-hook";
import styled from "@emotion/styled";
import { useProject } from "utils/project";
import { useUser } from "utils/user";
import { Button } from "antd";

export const ProjectList = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const debounceParam = useDebounce(param, 300);
  const { data: users } = useUser();
  const { isLoading, error, data: list } = useProject(debounceParam);
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
