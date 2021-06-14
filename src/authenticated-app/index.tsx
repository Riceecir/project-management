import React from "react";
import { ButtonNoPadding, Row } from "components/lib";
import { useAuth } from "context/auth-context";
import { Button, Dropdown, Menu } from "antd";
import styled from "@emotion/styled";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import { Navigate, Routes, Route, useNavigate } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { ProjectModal } from "screens/project-list/project-modal";
import { ProjectPopover } from "components/project-popover";
import { UserPopover } from "components/user-popover";

const ProjectList = React.lazy(() => import("screens/project-list"));
const ProjectScreen = React.lazy(() => import("screens/project"));

const AuthenticatedApp = () => {
  return (
    <Container>
      <Router>
        <Header />
        <Main>
          <Routes>
            <Navigate to={"/projects"} />
            <Route path={"/projects"} element={<ProjectList />} />
            <Route path={"/projects/:id/*"} element={<ProjectScreen />} />
          </Routes>
        </Main>
        <ProjectModal />
      </Router>
    </Container>
  );
};

export default AuthenticatedApp;

const Header = () => {
  const navigate = useNavigate();

  return (
    <PageHeader between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding
          type="link"
          onClick={() => navigate("/", { replace: true })}
        >
          <SoftwareLogo width="15rem" height={"100%"} />
        </ButtonNoPadding>
        <ProjectPopover />
        <UserPopover />
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
  z-index: 1;
  padding: 3.2rem;
  height: 6rem;
  background-color: white;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
`;

const HeaderLeft = styled(Row)``;

const HeaderRight = styled.div``;

const Main = styled.main`
  height: calc(100vh - 6rem);
  display: flex;
  overflow: hidden;
`;
