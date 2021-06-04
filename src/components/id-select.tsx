import React from "react";
import { Select } from "antd";
import { Raw } from "types";

/** https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#componentprops */
type SelectProps = React.ComponentProps<typeof Select>;

interface IdSelectProps
  extends Omit<
    SelectProps,
    "value" | "onChange" | "defaultOptionName" | "options"
  > {
  value?: Raw | null | undefined;
  onChange?: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}

/**
 * value 可传入多种类型
 * onChange 只会回调 number | undefined
 * 当 Number(value) === NaN 时, 代表选择默认选项
 * 选择默认选项时，onChage 会回调 undefined
 */
export const IdSelect = (props: IdSelectProps) => {
  const { value, onChange, defaultOptionName, options, ...resetProp } = props;
  return (
    <Select
      value={options?.length ? toNumber(value) : 0}
      onChange={(value) => onChange && onChange(toNumber(value) || undefined)}
      {...resetProp}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : null}
      {options &&
        options.map(({ id, name }) => (
          <Select.Option value={id} key={id}>
            {name}
          </Select.Option>
        ))}
    </Select>
  );
};

const toNumber = (value: unknown) => (isNaN(Number(value)) ? 0 : Number(value));
