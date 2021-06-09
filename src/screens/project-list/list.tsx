import React from "react";
import { Button, Dropdown, Menu, Table, TableProps, Modal } from "antd";
import { User } from "./search-panel";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Pin } from "components/pin";
import { useDeleteProject, useEditProject } from "api/project";
import { ButtonNoPadding } from "components/lib";
import { useProjectModal } from "utils/project";
import { useProjectsQueryKey } from "./utils";

export interface Project {
  id: number;
  name: string;
  personId: number;
  organization: string;
  created: number;
  pin: boolean;
}

interface ListProps extends TableProps<Project> {
  users: User[];
  refresh?: () => void;
}

export const List = ({ users, refresh, ...props }: ListProps) => {
  const { mutate } = useEditProject(useProjectsQueryKey());
  const pinProject = (id: number, pin: boolean) => mutate({ id, pin });

  return (
    <Table
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                onCheckedChange={(pin) => pinProject(project.id, pin)}
              />
            );
          },
        },
        {
          title: "名称",
          key: "name",
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            return <Link to={`${project.id}`}>{project.name}</Link>;
          },
        },
        {
          title: "部门",
          key: "organization",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          key: "personId",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          key: "created",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    />
  );
};

/* 更多操作 */
const More = ({ project }: { project: Project }) => {
  const { edit } = useProjectModal();
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());
  const editProject = (id: number) => edit(id);

  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: `确认删除"${project.name}"这个项目吗?`,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        deleteProject({ id });
      },
    });
  };

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={"edit"}>
            <Button type={"link"} onClick={() => editProject(project.id)}>
              编辑
            </Button>
          </Menu.Item>
          <Menu.Item key={"delete"}>
            <Button
              type={"link"}
              danger
              onClick={() => confirmDelete(project.id)}
            >
              删除
            </Button>
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={"link"}>...</ButtonNoPadding>
    </Dropdown>
  );
};
