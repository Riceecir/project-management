import React from "react";
import { Navigate, Routes, Route } from "react-router";
import { Link } from "react-router-dom";
import { BoardScreen } from "screens/board";
import { EpicScreen } from "screens/epic";
import { useUrlQueryParam } from "utils/custom-hook";

export const ProjectScreen = () => {
  useUrlQueryParam(["name"]);
  return (
    <div>
      <h1>Project</h1>
      <Link to="board">看板</Link>
      <Link to="epic">任务</Link>

      <Routes>
        <Navigate to="board" replace={true} />
        <Route path="/board" element={<BoardScreen />}></Route>
        <Route path="/epic" element={<EpicScreen />}></Route>
      </Routes>
    </div>
  );
};
