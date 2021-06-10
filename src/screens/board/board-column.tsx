import { useEditTask, useTasks, useTaskTypes } from "api/task";
import React from "react";
import { Board } from "types/board";
import { useBoardQueryKey, useTaskModal, useTasksSearchParams } from "./util";
import taskIcon from "assets/bug.svg";
import bugIcon from "assets/task.svg";
import styled from "@emotion/styled";
import { Button, Card, Dropdown, Menu, Modal, Row } from "antd";
import { CreateTask } from "./create-task";
import { Mark } from "components/mark";
import { Task } from "types/task";
import { useDeleteBoard } from "api/board";

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;

  if (!name) return null;
  return <img src={name === "task" ? taskIcon : bugIcon} alt="" />;
};

export const BoardColumn = ({ board }: { board: Board }) => {
  const { data: allTasks } = useTasks(useTasksSearchParams());
  const tasks = allTasks?.filter((item) => item.kanbanId === board.id);

  return (
    <Container>
      <Row align={"middle"} justify={"space-between"}>
        <h3>{board.name}</h3>
        <More board={board} />
      </Row>
      <TaskContainer>
        {tasks?.map((task) => (
          <TaskCard task={task} />
        ))}
        <CreateTask kanbanId={board.id} />
      </TaskContainer>
    </Container>
  );
};

const TaskCard = ({ task }: { task: Task }) => {
  const { edit } = useTaskModal();
  const { name } = useTasksSearchParams();
  return (
    <Card
      key={task.id}
      style={{ marginBottom: ".5rem", cursor: "pointer" }}
      onClick={() => edit(task.id)}
    >
      <Row align={"middle"}>
        <Mark str={task.name} keyword={name}></Mark>
        <TaskTypeIcon id={task.typeId} />
      </Row>
    </Card>
  );
};

/* 更多功能小组件 */
const More = ({ board }: { board: Board }) => {
  const { mutateAsync: deleteBoard } = useDeleteBoard(useBoardQueryKey());
  const handleDelete = () => {
    Modal.confirm({
      okText: "确认",
      cancelText: "取消",
      title: `确定删除${board.name}看板吗?`,
      onOk() {
        return deleteBoard({ id: board.id });
      },
    });
  };

  const overlay = (
    <Menu>
      <Menu.Item key={"delete"}>
        <Button type="link" danger onClick={handleDelete}>
          删除
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={overlay}>
      <Button type={"link"}>...</Button>
    </Dropdown>
  );
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 27rem;
  border-radius: 4px;
  background-color: rgb(246, 245, 245);
  padding: 0.6rem 0.6rem 1rem;
  margin-right: 0.5rem;
`;

const TaskContainer = styled.div`
  overflow: auto;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
`;
