import React, { useEffect } from "react";
import { Drawer, Spin, Form, Input, Button } from "antd";
import { useProjectModal } from "utils/project";
import { IdSelect } from "components/id-select";
import { useUser } from "api/user";
import { useAddProject, useEditProject } from "api/project";
import { ErrorBox } from "components/lib";
import styled from "@emotion/styled";
import { useProjectsQueryKey } from "./utils";

const formItemLayout = {
  // labelCol: { span: 6 },
  // wrapperCol: { span: 14 },
};

export const ProjectModal = () => {
  const { data: users } = useUser();
  const { projectModalOpen, editingProject, isLoading, close } =
    useProjectModal();
  const useMutateProject = editingProject ? useEditProject : useAddProject;

  const [form] = Form.useForm();
  const {
    mutateAsync,
    error,
    isLoading: mutateLoading,
  } = useMutateProject(useProjectsQueryKey());
  const onFinish = (values: {
    name: string;
    organization: string;
    personId: number;
  }) => {
    /* 传入old and new data，新数据覆盖旧数据 */
    mutateAsync({ ...editingProject, ...values }).then(() => {
      form.resetFields();
      close();
    });
  };

  /* 设置默认值 (只有在编辑时) */
  useEffect(() => {
    form.setFieldsValue(editingProject);
  }, [editingProject, form]);

  const title = editingProject ? "编辑项目" : "创建项目";

  return (
    <Drawer forceRender visible={projectModalOpen} onClose={close} width="100%">
      <Container>
        {isLoading ? (
          <Spin size={"large"} />
        ) : (
          <>
            <h1>{title}</h1>
            {error ? <ErrorBox error={error} /> : null}
            <Form
              form={form}
              layout={"vertical"}
              onFinish={onFinish}
              style={{ width: "40rem" }}
            >
              <Form.Item
                label={"名称"}
                name={"name"}
                rules={[{ required: true, message: "请输入项目名称" }]}
                {...formItemLayout}
              >
                <Input placeholder={"请输入项目名称"} />
              </Form.Item>

              <Form.Item
                label={"部门"}
                name={"organization"}
                rules={[{ required: true, message: "请输入部门名称" }]}
                {...formItemLayout}
              >
                <Input placeholder={"请输入部门名称"} />
              </Form.Item>

              <Form.Item label={"负责人"} name={"personId"} {...formItemLayout}>
                <IdSelect defaultOptionName={"负责人"} options={users || []} />
              </Form.Item>

              <BtnFormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={mutateLoading}
                  disabled={mutateLoading}
                >
                  提交
                </Button>
              </BtnFormItem>
            </Form>
          </>
        )}
      </Container>
    </Drawer>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 80vh;
`;

const BtnFormItem = styled(Form.Item)`
  text-align: right;
`;
