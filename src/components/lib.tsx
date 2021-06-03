import styled from "@emotion/styled";
import { Spin, Typography } from "antd";
import { DevTools } from "jira-dev-tool";

/**
 * @prop {} gap: 子元素是否设置 margin-right
 */
export const Row = styled.div<{
  gap?: Number | boolean;
  between?: boolean;
  marginBottom?: Number;
}>`
  display: flex;
  justify-content: ${(props) => (props.between ? "space-between" : undefined)};
  align-items: center;
  margin-bottom: ${(props) => props.marginBottom + "rem"};

  & > * {
    margin-top: 0;
    margin-bottom: 0;
    margin-right: ${(props) =>
      typeof props.gap === "number"
        ? props.gap + "rem"
        : props.gap
        ? "2rem"
        : undefined};
  }
`;

/**
 * 全屏加载动画
 */
const FullPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
export const FullPageLoading = () => (
  <FullPage>
    <Spin size="large" />
  </FullPage>
);

/**
 * 全屏错误信息
 */
export const FullPageError = ({ error }: { error: Error | null }) => (
  <FullPage>
    <DevTools />
    <Typography.Text type="danger">{error?.message}</Typography.Text>
  </FullPage>
);
