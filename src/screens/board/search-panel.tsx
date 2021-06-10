import React from "react";
import { Row } from "components/lib";
import { useSetUrlQueryParam } from "utils/custom-hook";
import { useTasksSearchParams } from "./util";
import { Button, Input } from "antd";
import { IdSelect } from "components/id-select";
import { useUser } from "api/user";
import { useTaskTypes } from "api/task";

/* 看板 - 任务筛选 */
export const SearchPanel = () => {
  const { data: users } = useUser();
  const { data: taskTypes } = useTaskTypes();
  const searchParams = useTasksSearchParams();
  const setSearchParams = useSetUrlQueryParam();

  const reset = () => {
    setSearchParams({
      typeId: undefined,
      processorId: undefined,
      tagId: undefined,
      name: undefined,
    });
  };

  return (
    <Row marginBottom={2} gap>
      <Input
        style={{ width: "20rem" }}
        placeholder={"任务名"}
        value={searchParams.name}
        onChange={(e) => setSearchParams({ name: e.target.value })}
      />

      <IdSelect
        defaultOptionName={"负责人"}
        value={searchParams.processorId}
        options={users || []}
        onChange={(value) => setSearchParams({ processorId: value })}
      />

      <IdSelect
        defaultOptionName={"类型"}
        value={searchParams.typeId}
        options={taskTypes || []}
        onChange={(value) => setSearchParams({ typeId: value })}
      />

      <Button onClick={reset}>重置</Button>
    </Row>
  );
};
