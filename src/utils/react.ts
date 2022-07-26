import React from "react";

/**
 * Extracts props from an element.
 *
 * Only use for library-like APIs like the design system.
 */
export type PropsOf<Tag = any> = Tag extends React.ElementType // eslint-disable-line
  ? React.ComponentProps<Tag>
  : never;

/**
 * Tap into a forwarded ref.
 *
 * Don't abuse (avoid refs!).  See existing usage for examples of leaf-node
 * input refs where it makes sense.
 */
export function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
  const innerRef = React.useRef<T | null>(null);

  React.useEffect(() => {
    if (!ref) {
      return;
    }
    if (typeof ref === "function") {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  });

  return innerRef;
}

/**
 * Give it a ref.  It tells you when it's focused.
 *
 * Prefer real CSS shit.
 */
export function useRefHasFocus<T extends HTMLElement>(ref: React.RefObject<T>) {
  const [focused, setFocus] = React.useState(false);

  React.useEffect(() => {
    function setFocused() {
      setFocus(true);
    }
    function unsetFocused() {
      setFocus(false);
    }

    if (ref?.current) {
      ref.current.addEventListener("focus", setFocused);
      ref.current.addEventListener("blur", unsetFocused);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("focus", setFocused);
        ref.current.removeEventListener("blur", unsetFocused);
      }
    };
  }, []);

  return focused;
}
