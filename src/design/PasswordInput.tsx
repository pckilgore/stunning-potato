import React from "react";
import {
  BaseProps,
  InternalOnlyBaseInputWithStyles as Base,
} from "./BaseInput";

export const PasswordInput = React.forwardRef<HTMLInputElement, BaseProps>(
  (props, ref) => <Base {...props} type="password" ref={ref} />
);
