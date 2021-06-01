import { useAuth } from "context/auth-context";
import React from "react";
import { Form, Input, Button } from "antd";

export const Register = () => {
  const { register, user } = useAuth();

  return (
    <Form onFinish={register}>
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

      <Button htmlType="submit" type="primary">
        注册
      </Button>
    </Form>
  );
};
