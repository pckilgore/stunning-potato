import React from "react";
import cx from "clsx";

export type BaseProps = {
  label: string;
  id: string;
  required?: boolean;
  error?: boolean;
} & Omit<React.HTMLProps<HTMLInputElement>, "className" | "aria-required">;

const base = "";

const readyStyle = "";
const disabledStyle = "";
const errorStyle = "";

export const InternalOnlyBaseInputWithStyles = React.forwardRef<
  HTMLInputElement,
  BaseProps
>((props, ref) => {
  const { id, label, required, disabled, error, ...rest } = props;

  const labelStyle = "top-[0.4rem]";

  return (
    <div className="flex relative flex-wrap items-stretch w-full border-none ease-in-out">
      <label className={labelStyle}>{label}</label>
      <input
        ref={ref}
        {...rest}
        disabled={disabled}
        aria-required={!disabled && required}
        id={id}
        className={cx(base, {
          [readyStyle]: !disabled && !error,
          [disabledStyle]: disabled,
          [errorStyle]: error && !disabled,
        })}
      />
    </div>
  );
});
