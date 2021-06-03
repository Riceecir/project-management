/* 错误边界 */
import React from "react";

type FallBackRender = (props: { error: Error | null }) => React.ReactElement;

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallBackRender }>,
  { error: Error | null }
> {
  state = { error: null };

  /** 子组件抛出异常, getDerivedStateFromError接受异常并调用
   * 返回值会赋值给state
   */
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;
    if (error) return fallbackRender({ error });
    return children;
  }
}
