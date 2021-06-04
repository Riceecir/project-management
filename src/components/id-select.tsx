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
