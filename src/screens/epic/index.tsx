import React, { useState } from "react";
import dayjs from "dayjs";
import { useDeleteEpic, useEpics } from "api/epic";
import { useTasks } from "api/task";
import { useEpicsQueryKey, useEpicsSearchParams } from "./util";
import { useProjectInUrl } from "screens/board/util";
import { useDocumentTitle } from "utils/custom-hook";
import { Button, List, Modal } from "antd";
import { Row, ScreenContainer } from "components/lib";
import { Link } from "react-router-dom";
import { CreateEpic } from "./create-epic";
import { Epic } from "types/epic";

const EpicScreen = () => {
  useDocumentTitle("任务组");
  const { data: currentProject } = useProjectInUrl();
  const { data: epics } = useEpics(useEpicsSearchParams());
  const { data: tasks } = useTasks({ projectId: currentProject?.id });
  const { mutateAsync: deleteEpic } = useDeleteEpic(useEpicsQueryKey());
  const [epicCreateOpen, setEpicCreateOpen] = useState(false);

  const confirmDeleteEpic = (epic: Epic) => {
    Modal.confirm({
      title: `确定删除${epic.name}项目组`,
      okText: "确定",
      onOk() {
        deleteEpic({ id: epic.id });
      },
    });
  };

  return (
    <ScreenContainer>
      <Row between>
        <h1>{currentProject?.name}任务组</h1>
        <Button type={"link"} onClick={() => setEpicCreateOpen(true)}>
          新建任务组
        </Button>
      </Row>
      <List
        style={{ overflow: "auto" }}
        dataSource={epics}
        itemLayout={"vertical"}
        renderItem={(epic) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row between>
                  <span>{epic.name}</span>
                  <Button
                    danger
                    type={"link"}
                    onClick={() => confirmDeleteEpic(epic)}
                  >
                    删除
                  </Button>
                </Row>
              }
              description={
                <div>
                  <div>开始时间：{dayjs(epic.start).format("YYYY-MM-DD")}</div>
                  <div>结束时间：{dayjs(epic.end).format("YYYY-MM-DD")}</div>
                </div>
              }
            />

            <div>
              {tasks
                ?.filter((task) => task.epicId === epic.id)
                .map((task) => (
                  <Link
                    to={`/projects/${currentProject?.id}/board?editingTaskId=${task.id}`}
                    key={task.id}
                  >
                    {task.name}
                  </Link>
                ))}
            </div>
          </List.Item>
        )}
      ></List>

      <CreateEpic
        visible={epicCreateOpen}
        onClose={() => setEpicCreateOpen(false)}
      />
    </ScreenContainer>
  );
};

export default EpicScreen;
