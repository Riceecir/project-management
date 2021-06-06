import React, { useState } from "react";
import { ButtonNoPadding, Row } from "components/lib";
import { ProjectList } from "screens/project-list";
import { useAuth } from "context/auth-context";
import { Button, Dropdown, Menu } from "antd";
import styled from "@emotion/styled";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import { Navigate, Routes, Route } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { ProjectScreen } from "screens/project";
import { resetRoute } from "utils";
import { ProjectModal } from "screens/project-list/project-modal";
import { ProjectPopover } from "components/project-popover";

export const AuthenticatedApp = () => {
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  return (
    <Container>
      <Header setProjectModalOpen={setProjectModalOpen} />
      <Main>
        <Router>
          <Routes>
            <Navigate to={"/projects"} />
            <Route
              path={"/projects"}
              element={
                <ProjectList setProjectModalOpen={setProjectModalOpen} />
              }
            />
            <Route path={"/projects/:id/*"} element={<ProjectScreen />} />
          </Routes>
        </Router>
      </Main>

      <ProjectModal
        projectModalOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />
    </Container>
  );
};

const Header = ({
  setProjectModalOpen,
}: {
  setProjectModalOpen: (isBoolen: boolean) => void;
}) => {
  return (
    <PageHeader between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type="link" onClick={resetRoute}>
          <SoftwareLogo width="15rem" />
        </ButtonNoPadding>
        <ProjectPopover setProjectModalOpen={setProjectModalOpen} />
        <h3>用户</h3>
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </PageHeader>
  );
};

const User = () => {
  const { user, logout } = useAuth();

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key="logout">
            <Button type="link" onClick={() => logout()}>
              登出
            </Button>
          </Menu.Item>
        </Menu>
      }
    >
      <Button type="link">Hi, {user?.name}</Button>
    </Dropdown>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem calc(100vh - 6rem);
  height: 100%;
`;

const PageHeader = styled(Row)`
  padding: 3.2rem;
  height: 6rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
`;

const HeaderLeft = styled(Row)``;

const HeaderRight = styled.div``;

const Main = styled.main`
  height: calc(100vh - 6rem);
`;
