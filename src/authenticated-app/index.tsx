import React from "react";
import { ProjectList } from "screens/project-list";
import { useAuth } from "context/auth-context";
import { Button } from "antd";
import { Row } from "components/lib";
import styled from "@emotion/styled";

export const AuthenticatedApp = () => {
  const { logout } = useAuth();

  return (
    <Container>
      <PageHeader between={true}>
        <HeaderLeft gap={true}>
          <h3>logo</h3>
          <h3>项目</h3>
          <h3>用户</h3>
        </HeaderLeft>
        <HeaderRight>
          <Button onClick={() => logout()}>登出</Button>
        </HeaderRight>
      </PageHeader>

      <Main>
        <ProjectList />
      </Main>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem calc(100vh - 6rem);
  height: 100%;
`;

const PageHeader = styled(Row)`
  height: 6rem;
`;

const HeaderLeft = styled(Row)``;

const HeaderRight = styled.div``;

const Main = styled.main`
  height: calc(100vh - 6rem);
`;
