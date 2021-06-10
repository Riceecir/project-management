import React, { useState } from "react";
import { Button, Card, Input } from "antd";
import { useAddTask } from "api/task";
import { useProjectIdInUrl, useTasksQueryKey } from "./util";

export const CreateTask = ({ kanbanId }: { kanbanId: number }) => {
  const [name, setName] = useState("");
  const { mutateAsync: addTask } = useAddTask(useTasksQueryKey());
  const projectId = useProjectIdInUrl();
  const [inputMode, setInputMode] = useState(false);

  const submit = async () => {
    await addTask({ projectId, name, kanbanId });
    setInputMode(false);
    setName("");
  };
  /* 切换开关 */
  const toggleMode = () => setInputMode((mode) => !mode);

  if (!inputMode)
    return (
      <Button type={"link"} onClick={toggleMode}>
        +创建任务
      </Button>
    );

  return (
    <Card>
      <Input
        value={name}
        placeholder={"请输入任务名称"}
        autoFocus
        onBlur={toggleMode}
        onPressEnter={submit}
        onChange={(e) => setName(e.target.value)}
      />
    </Card>
  );
};
