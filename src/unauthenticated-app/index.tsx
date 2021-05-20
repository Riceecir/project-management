import { Login } from "unauthenticated-app/login";
import { Register } from "unauthenticated-app/register";
import React, { useState } from "react";

export const UnauthenticatedApp = () => {
  const [isRegister, setIsRegister] = useState(true);

  return (
    <div>
      {isRegister ? <Login /> : <Register />}

      <button onClick={() => setIsRegister(!isRegister)}>
        切换到{isRegister ? "注册" : "登录"}
      </button>
    </div>
  );
};
