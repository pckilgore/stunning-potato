import React from "react";
import cn from "clsx";
import { useForwardedRef, useRefHasFocus } from "../utils/react";

export type BaseProps = {
  label: string;
  id: string;
  required?: boolean;
  inputClass?: string;
  error?: boolean;
  permaValue?: boolean; // Some HTML5 inputs always show something so keep label small
} & Omit<React.HTMLProps<HTMLInputElement>, "className" | "aria-required">;

const base =
  "peer w-full outline-none bg-transparent flex justify-end leading-none pt-4";

const borderBase =
  "border-b focus:border-b-dark-brand-500 invalid:border-b-dark-accent-red";

const readyStyle = "";
const disabledStyle = "";

const Widget = ({ color }: { color: string }) => {
  return (
    <div
      aria-hidden
      className={cn(
        color,
        "absolute origin-bottom-right bottom-px right-0 border-b-8 border-l-8 border-l-dark-background-100 border-b-dark-gray-50 [transform:matrix(2,0,0,1,0,0)]"
      )}
    />
  );
};

export const InternalOnlyBaseInputWithStyles = React.forwardRef<
  HTMLInputElement,
  BaseProps
>((props, ref) => {
  const innerRef = useForwardedRef(ref);
  const focused = useRefHasFocus(innerRef);
  const {
    id,
    label,
    value,
    required,
    disabled,
    error,
    inputClass,
    permaValue,
    placeholder: _,
    ...rest
  } = props;

  const border = cn(
    borderBase,
    error ? "border-accent-red" : "border-dark-gray-150"
  );

  const labelStyle = cn(
    "absolute flex text-dark-gray-600 transition-all",
    focused || value || permaValue
      ? "items-start top-1 text-xs"
      : "items-center top-1/3 text-base font-medium"
  );

  return (
    <div className="group flex grow h-14 relative">
      <label htmlFor={id} className={labelStyle}>
        {label}
      </label>
      <input
        ref={innerRef}
        value={value}
        {...rest}
        disabled={disabled}
        aria-required={!disabled && required}
        id={id}
        className={cn(base, inputClass, border, {
          [readyStyle]: !disabled,
          [disabledStyle]: disabled,
        })}
      />
      <Widget
        color={cn({
          "border-b-accent-red": error,
          "border-b-dark-brand-500": focused,
          "border-b-dark-gray-150": !error && !focused,
        })}
      />
    </div>
  );
});
