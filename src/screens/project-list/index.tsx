import React, { useState, useEffect } from "react";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { cleanObject } from "../../utils";
import { useDebounce } from "../../utils/custom-hook";
import { useHttp } from "plugins/request";
import styled from "@emotion/styled";

export const ProjectList = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const debounceParam = useDebounce(param, 300);
  const http = useHttp();

  /* 获取负责人列表 */
  useEffect(() => {
    http("users").then(setUsers);
  }, []);

  /* 获取列表 */
  useEffect(() => {
    http("projects", { data: cleanObject(param) }).then(setList);
  }, [debounceParam]);

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel param={param} setParam={setParam} users={users} />
      <List list={list} users={users} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
