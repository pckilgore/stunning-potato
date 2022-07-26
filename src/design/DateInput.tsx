import React from "react";
import {
  BaseProps,
  InternalOnlyBaseInputWithStyles as Base,
} from "./BaseInput";

export const DateInput = React.forwardRef<HTMLInputElement, BaseProps>(
  (props, ref) => <Base {...props} type="date" ref={ref} permaValue />
);
