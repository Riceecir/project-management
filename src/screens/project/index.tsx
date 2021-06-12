import React from "react";
import { Navigate, Routes, Route, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useUrlQueryParam } from "utils/custom-hook";
import styled from "@emotion/styled";
import { Menu } from "antd";

const BoardScreen = React.lazy(() => import("screens/board"));
const EpicScreen = React.lazy(() => import("screens/epic"));

const useCurrentRoute = () => {
  const units = useLocation().pathname.split("/");

  return units[units.length - 1];
};

const ProjectScreen = () => {
  const route = useCurrentRoute();

  useUrlQueryParam(["name"]);
  return (
    <Container>
      <Aside>
        <Menu mode={"inline"} selectedKeys={[route]}>
          <Menu.Item key={"board"}>
            <Link to="board">看板</Link>
          </Menu.Item>
          <Menu.Item key={"epic"}>
            <Link to="epic">任务</Link>
          </Menu.Item>
        </Menu>
      </Aside>

      <Main>
        <Routes>
          <Navigate to="board" replace={true} />
          <Route path="/board" element={<BoardScreen />}></Route>
          <Route path="/epic" element={<EpicScreen />}></Route>
        </Routes>
      </Main>
    </Container>
  );
};

export default ProjectScreen;

const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
  width: 100%;
  overflow: hidden;
`;

const Aside = styled.div`
  background-color: rgb(250, 250, 250);
  display: flex;
`;

const Main = styled.div`
  display: flex;
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;
