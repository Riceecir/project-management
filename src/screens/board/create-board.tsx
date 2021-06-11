import React, { useState } from "react";
import { useBoardQueryKey, useProjectIdInUrl } from "./util";
import { Container } from "screens/board/board-column";
import { Input } from "antd";
import { useAddBoard } from "api/board";

/* 创建看板 */
export const CreateBoard = React.forwardRef((props: any, ref: any) => {
  const [name, setName] = useState("");
  const projectId = useProjectIdInUrl();
  const { mutateAsync: addBoard } = useAddBoard(useBoardQueryKey());

  const submit = async () => {
    await addBoard({ name, projectId });
    setName("");
  };

  return (
    <Container ref={ref}>
      <Input
        value={name}
        placeholder={"新建看板名称"}
        onPressEnter={submit}
        onChange={(e) => setName(e.target.value)}
      />
    </Container>
  );
});
