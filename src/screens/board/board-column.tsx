import { useTasks, useTaskTypes } from "api/task";
import React from "react";
import { Board } from "types/board";
import { useTasksSearchParams } from "./util";
import taskIcon from "assets/bug.svg";
import bugIcon from "assets/task.svg";
import styled from "@emotion/styled";
import { Card, Row } from "antd";
/* import { ReactComponent as TaskIcon } from 'assets/bug.svg'
import { ReactComponent as BugIcon } from 'assets/task.svg' */

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;

  if (!name) return null;
  // return (name === 'task' ? <TaskIcon /> : <BugIcon />)
  return <img src={name === "task" ? taskIcon : bugIcon} alt="" />;
};

export const BoardColumn = ({ board }: { board: Board }) => {
  const { data: allTasks } = useTasks(useTasksSearchParams());
  const tasks = allTasks?.filter((item) => item.kanbanId === board.id);

  return (
    <Container>
      <h3>{board.name}</h3>
      <TaskContainer>
        {tasks?.map((task) => (
          <Card key={task.id} style={{ marginBottom: ".5rem" }}>
            <Row align={"middle"}>
              <span>{task.name}</span>
              <TaskTypeIcon id={task.id} />
            </Row>
          </Card>
        ))}
      </TaskContainer>
    </Container>
  );
};

const Container = styled.div`
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
