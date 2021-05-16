import React, { FormEvent } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

interface LoginParam {
  username: string;
  password: string;
}

export const Login = () => {
  const login = (param: LoginParam) => {
    fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(param),
    });
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const username = (e.currentTarget.elements[0] as HTMLInputElement).value;
    const password = (e.currentTarget.elements[1] as HTMLInputElement).value;
    login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">用户名</label>
        <input type="text" id={"username"} />
      </div>

      <div>
        <label htmlFor="password">密码</label>
        <input type="password" id={"password"} />
      </div>

      <button type="submit">登录</button>
    </form>
  );
};
