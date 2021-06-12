import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { useBoards, useReorderBoard } from "api/board";
import { FullPageLoading, ScreenContainer } from "components/lib";
import { useLocation, useParams } from "react-router";
import { useDocumentTitle } from "utils/custom-hook";
import { BoardColumn } from "./board-column";
import { SearchPanel } from "./search-panel";
import {
  useBoardQueryKey,
  useBoardSearchParams,
  useProjectInUrl,
  useTasksQueryKey,
  useTasksSearchParams,
} from "./util";
import { useReorderTask, useTasks } from "api/task";
import { CreateBoard } from "./create-board";
import { TaskModal } from "./task-modal";
import {
  DragDropContext,
  DropResult,
  /* Droppable,
  Draggable */
} from "react-beautiful-dnd";
import { Drag, Drop, DropChild } from "components/drag-and-drop";

const BoardScreen = () => {
  useDocumentTitle("看板列表");
  const { data: currentProject } = useProjectInUrl();
  const { data: boards, isLoading: boardIsLoading } = useBoards(
    useBoardSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());
  const isLoading = boardIsLoading || taskIsLoading;
  const dragEnd = useDragEnd();

  return (
    <ScreenContainer>
      <DragDropContext onDragEnd={dragEnd}>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel />
        {isLoading ? (
          <FullPageLoading />
        ) : (
          /* 不使用封装好的组件实现 */
          <ColumnsContaier>
            {/* <Droppable droppableId={"board"} type={"COLUMN"} direction={"horizontal"}>
              {
                provided => (
                  <div style={{ display: "flex" }} ref={provided.innerRef} {...provided.droppableProps}>
                    {
                      boards?.map((item, index) => {
                        return (
                          <Draggable draggableId={"board" + index} index={index} key={index}>
                            {
                              provided => (
                                <BoardColumn ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} board={item} key={item.id} />
                              )
                            }
                          </Draggable>
                        )
                      })
                    }
                  </div>
                )
              }
            </Droppable>
            <CreateBoard /> */}
            <Drop
              type={"COLUMN"}
              direction={"horizontal"}
              droppableId={"board"}
            >
              <DropChild style={{ display: "flex" }}>
                {boards?.map((board, index) => {
                  return (
                    <Drag
                      draggableId={"board" + board.id}
                      index={index}
                      key={board.id}
                    >
                      <BoardColumn board={board} key={board.id} />
                    </Drag>
                  );
                })}
              </DropChild>
            </Drop>
            <CreateBoard />
          </ColumnsContaier>
        )}
        <TaskModal />
      </DragDropContext>
    </ScreenContainer>
  );
};

export default BoardScreen;

/* 拖拽完成 */
const useDragEnd = () => {
  const { data: boards } = useBoards(useBoardSearchParams());
  const { data: allTasks = [] } = useTasks(useTasksSearchParams());
  const { mutate: reorderBoard } = useReorderBoard(useBoardQueryKey());
  const { mutate: reorderTask } = useReorderTask(useTasksQueryKey());

  return useCallback(
    ({ source, destination, type }: DropResult) => {
      console.log({ source, destination, type });
      if (!destination) return;

      // 看板排序
      if (type === "COLUMN") {
        const fromId = boards?.[source.index].id;
        const toId = boards?.[destination.index].id;

        if (!fromId || !toId || fromId === toId) return;

        const type = destination.index > source.index ? "after" : "before";
        reorderBoard({ fromId, referenceId: toId, type });
      }

      // 任务排序
      if (type === "ROW") {
        const formBoardId = +source.droppableId;
        const toBoardId = +destination.droppableId;

        const formTask = allTasks?.filter(
          (item) => item.kanbanId === formBoardId
        )[source.index];
        const toTask = allTasks?.filter((item) => item.kanbanId === toBoardId)[
          destination.index
        ];

        // 无位移
        if (formTask?.id === toTask?.id) return;

        const type =
          formBoardId === toBoardId && destination.index > source.index
            ? "after"
            : "before";
        reorderTask({
          fromId: formTask?.id,
          referenceId: toTask?.id,
          fromKanbanId: Number(formBoardId),
          toKanbanId: Number(toBoardId),
          type: type,
        });
      }
    },
    [boards, allTasks, reorderBoard, reorderTask]
  );
};

const ColumnsContaier = styled.div`
  flex: 1;
  display: flex;
  overflow: auto;
  margin-right: 2rem;
`;
