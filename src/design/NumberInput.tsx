import React from "react";
import {
  BaseProps,
  InternalOnlyBaseInputWithStyles as Base,
} from "./BaseInput";

export const NumberInput = React.forwardRef<HTMLInputElement, BaseProps>(
  function NumberInput(props, ref) {
    return <Base {...props} type="text" ref={ref} />;
  }
);
