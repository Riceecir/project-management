export type Raw = string | number;

/* 排序参数 */
export interface SortProps {
  // 需要排序的 item
  fromId: number;
  // 目标 item
  referenceId: number;
  // 前 or 后
  type: "before" | "after";
  fromKanbanId?: number;
  toKanbanId?: number;
}
