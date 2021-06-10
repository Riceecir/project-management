import styled from "@emotion/styled";
import { useBoards } from "api/board";
import React from "react";
import { useLocation, useParams } from "react-router";
import { useDocumentTitle } from "utils/custom-hook";
import { BoardColumn } from "./board-column";
import { SearchPanel } from "./search-panel";
import { useBoardSearchParams, useProjectInUrl } from "./util";

export const BoardScreen = () => {
  useDocumentTitle("看板列表");
  const { data: currentProject } = useProjectInUrl();
  const { data: boards } = useBoards(useBoardSearchParams());
  return (
    <div>
      <h1>{currentProject?.name}看板</h1>
      <SearchPanel />
      <ColumnsContaier>
        {boards?.map((item) => (
          <BoardColumn board={item} key={item.id} />
        ))}
      </ColumnsContaier>
    </div>
  );
};

const ColumnsContaier = styled.div`
  display: flex;
  overflow: hidden;
  margin-right: 2rem;
`;
