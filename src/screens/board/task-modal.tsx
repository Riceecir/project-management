import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Row } from "antd";
import { useTaskModal, useTasksQueryKey } from "./util";
import { useDeleteTask, useEditTask, useTaskTypes } from "api/task";
import { IdSelect } from "components/id-select";
import { useUser } from "api/user";

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

export const TaskModal = () => {
  const { data: users } = useUser();
  const { data: taskTypes } = useTaskTypes();

  const [form] = Form.useForm();
  const { editingTask, editingTaskId, close } = useTaskModal();
  const { mutateAsync: editTask, isLoading: edieLoading } = useEditTask(
    useTasksQueryKey()
  );
  const { mutateAsync: deleteTask } = useDeleteTask(useTasksQueryKey());

  const onClose = () => {
    close();
    form.resetFields();
  };

  const onOk = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() });
    close();
  };

  const handleDelete = () => {
    Modal.confirm({
      okText: "确认",
      cancelText: "取消",
      title: `确定删除任务吗?`,
      onOk() {
        return deleteTask({ id: Number(editingTaskId) }).then(close);
      },
    });
  };

  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [form, editingTask]);

  return (
    <Modal
      visible={!!editingTaskId}
      title={"编辑任务"}
      forceRender
      okText={"确定"}
      cancelText={"取消"}
      confirmLoading={edieLoading}
      onCancel={onClose}
      onOk={onOk}
    >
      <Form initialValues={editingTask} form={form} {...formItemLayout}>
        <Form.Item
          label={"任务名"}
          name={"name"}
          rules={[{ required: true, message: "请输入任务名" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label={"经办人"} name={"processorId"}>
          <IdSelect defaultOptionName={"经办人"} options={users || []} />
        </Form.Item>

        <Form.Item label={"类型"} name={"typeId"}>
          <IdSelect defaultOptionName={"类型"} options={taskTypes || []} />
        </Form.Item>

        <Row justify={"end"} align={"middle"}>
          <Button type={"link"} danger onClick={handleDelete}>
            删除
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};
