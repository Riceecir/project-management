import React from "react";
import { useAuth } from "context/auth-context";
import { Form, Input, Button } from "antd";
import { useAsync } from "utils/custom-hook";

export const Login = ({ onError }: { onError: (error: Error) => void }) => {
  const { login } = useAuth();
  const { run, isLoading } = useAsync(undefined, { throwOnError: true });
  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    run(login(values)).catch(onError);
  };
  /* onFinish 根据 Form.Item 返回对应的 object */
  return (
    <Form onFinish={handleSubmit}>
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

      <Button
        block
        loading={isLoading}
        disabled={isLoading}
        htmlType="submit"
        type="primary"
      >
        登录
      </Button>
    </Form>
  );
};
