import { useAuth } from "context/auth-context";
import React from "react";
import { Form, Input, Button } from "antd";

export const Login = () => {
  const { login, user } = useAuth();

  /* onFinish 根据 Form.Item 返回对应的 object */
  return (
    <Form onFinish={login}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input placeholder="用户名" id="username" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input.Password placeholder="密码" id="password" />
      </Form.Item>

      <Button block htmlType="submit" type="primary">
        登录
      </Button>
    </Form>
  );
};
