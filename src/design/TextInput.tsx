import React from "react"
import { BaseProps, InternalOnlyBaseInputWithStyles as Base } from './BaseInput'

export const TextInput = React.forwardRef<HTMLInputElement, BaseProps>(
  (props, ref) => <Base {...props} type="text" ref={ref}  />
)

