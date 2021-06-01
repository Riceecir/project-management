import { Login } from "unauthenticated-app/login";
import { Register } from "unauthenticated-app/register";
import React, { useState } from "react";
import { Card, Button } from "antd";

export const UnauthenticatedApp = () => {
  const [isRegister, setIsRegister] = useState(true);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card>
        {isRegister ? <Login /> : <Register />}
        <Button onClick={() => setIsRegister(!isRegister)}>
          切换到{isRegister ? "注册" : "登录"}
        </Button>
      </Card>
    </div>
  );
};
