import { Login } from "unauthenticated-app/login";
import { Register } from "unauthenticated-app/register";
import React from "react";
import { Card, Button, Divider, message } from "antd";
import styled from "@emotion/styled";
/* logo and bgimg */
import logo from "assets/logo.svg";
import left from "assets/left.svg";
import right from "assets/right.svg";
import { useDocumentTitle } from "utils/custom-hook";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

const UnauthenticatedApp = () => {
  useDocumentTitle("请登录/注册");
  const location = useLocation();
  const navigate = useNavigate();
  const isRegister = location.pathname.toLowerCase() === "/login";
  const handleError = (error: Error) => {
    message.error(error.message);
  };
  return (
    <Container>
      <Header />
      <Background />
      <ShadowCard>
        <Title>{isRegister ? "请登录" : "请注册"}</Title>
        <Routes>
          <Navigate to={"/login"} />

          <Route
            path={"/login"}
            element={
              <Login onSuccess={() => navigate("/")} onError={handleError} />
            }
          />

          <Route
            path={"/register"}
            element={
              <Register onSuccess={() => navigate("/")} onError={handleError} />
            }
          />
        </Routes>
        <Divider />
        <Button
          type="link"
          onClick={() => navigate(isRegister ? "/register" : "/login")}
        >
          {isRegister ? "没有账号?注册新账号" : "已有账号?直接登录"}
        </Button>
      </ShadowCard>
    </Container>
  );
};

export default UnauthenticatedApp;

const cardWidth = "40rem";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const Title = styled.h2`
  margin-bottom: 2.4rem;
  color: rgb(90, 108, 130);
`;

const Header = styled.div`
  padding: 8rem 0;
  background: url(${logo}) no-repeat center;
  background-size: 10rem;
  width: 100%;
`;

const ShadowCard = styled(Card)`
  width: ${cardWidth};
  min-height: 56rem;
  padding: 3.2rem 4rem;
  border-radius: 0.3rem;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.3) 0 0 10px;
  text-align: center;
`;

/* 两侧背景图 */
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: left bottom, right bottom;
  background-size: calc((100vw - ${cardWidth}) / 2),
    calc((100vw - ${cardWidth}) / 2), cover;
  background-image: url(${left}), url(${right});
`;
