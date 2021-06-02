import { Login } from "unauthenticated-app/login";
import { Register } from "unauthenticated-app/register";
import React, { useState } from "react";
import { Card, Button, Divider } from "antd";
import styled from "@emotion/styled";
/* logo and bgimg */
import logo from "assets/logo.svg";
import left from "assets/left.svg";
import right from "assets/right.svg";

export const UnauthenticatedApp = () => {
  const [isRegister, setIsRegister] = useState(true);

  return (
    <Container>
      <Header />
      <Background />
      <ShadowCard>
        <Title>{isRegister ? "请登录" : "请注册"}</Title>
        {isRegister ? <Login /> : <Register />}
        <Divider />
        <Button type="link" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "没有账号?注册新账号" : "已有账号?直接登录"}
        </Button>
      </ShadowCard>
    </Container>
  );
};

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
  padding: 5rem 0;
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