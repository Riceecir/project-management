import { useAuth } from "context/auth-context";
import React from "react";
import { Form, Input, Button } from "antd";
import { useAsync } from "utils/custom-hook";

export const Register = ({
  onError,
  onSuccess,
}: {
  onError: (error: Error) => void;
  onSuccess: () => void;
}) => {
  const { register } = useAuth();
  const { run, isLoading } = useAsync(undefined, { throwOnError: true });
  const handleSubmit = async ({
    cpassword,
    ...values
  }: {
    username: string;
    password: string;
    cpassword: string;
  }) => {
    if (cpassword !== values.password) {
      return onError(new Error("请确认两次输入的密码相同!"));
    }
    run(register(values)).then(onSuccess).catch(onError);
  };

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

      <Form.Item
        name="cpassword"
        rules={[{ required: true, message: "请确认密码" }]}
      >
        <Input.Password placeholder="请确认密码" id="cpassword" />
      </Form.Item>

      <Button
        block
        loading={isLoading}
        disabled={isLoading}
        htmlType="submit"
        type="primary"
      >
        注册
      </Button>
    </Form>
  );
};
