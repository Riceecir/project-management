import styled from "@emotion/styled";

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
    margin-right: ${({ gap }) =>
      typeof gap === "number" ? gap + "rem" : gap ? "2rem" : undefined};
  }
`;
