import React from "react";
import styled from "@emotion/styled";
import { useBoards } from "api/board";
import { FullPageLoading, ScreenContainer } from "components/lib";
import { useLocation, useParams } from "react-router";
import { useDocumentTitle } from "utils/custom-hook";
import { BoardColumn } from "./board-column";
import { SearchPanel } from "./search-panel";
import {
  useBoardSearchParams,
  useProjectInUrl,
  useTasksSearchParams,
} from "./util";
import { useTasks } from "api/task";
import { CreateBoard } from "./create-board";
import { TaskModal } from "./task-modal";

export const BoardScreen = () => {
  useDocumentTitle("看板列表");
  const { data: currentProject } = useProjectInUrl();
  const { data: boards, isLoading: boardIsLoading } = useBoards(
    useBoardSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());
  const isLoading = boardIsLoading || taskIsLoading;

  return (
    <ScreenContainer>
      <h1>{currentProject?.name}看板</h1>
      <SearchPanel />
      {isLoading ? (
        <FullPageLoading />
      ) : (
        <ColumnsContaier>
          {boards?.map((item) => (
            <BoardColumn board={item} key={item.id} />
          ))}
          <CreateBoard />
        </ColumnsContaier>
      )}

      <TaskModal />
    </ScreenContainer>
  );
};

const ColumnsContaier = styled.div`
  flex: 1;
  display: flex;
  overflow: auto;
  margin-right: 2rem;
`;
