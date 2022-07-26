import React from "react";
import cn from "clsx";

import type { PropsOf } from "../utils/react";

const DEFAULT_TAG = "p" as const;

const baseColor = "text-gray-700 dark:text-gray-50";
const variants = {
  body: "font-sans text-base",
  label: "font-sans text-xs",
  h3: "font-serif text-3xl",
  h4: "font-sans text-2xl font-semibold",
  h1: "",
  "body-small": "font-sans text-s",
};

type PropsWeControl = "as" | "variant" | "bold" | "semibold" | "color" | "link";
type Props<T> = {
  as?: T;
  variant?: keyof typeof variants;
  bold?: boolean;
  semibold?: boolean;
  color?: string;
  /* Give text a hover effect */
  link?: boolean; // I will regret this.  (7/23/22 -- Patrick)
};

export function Text<Tag extends React.ElementType = typeof DEFAULT_TAG>(
  props: Omit<PropsOf<Tag>, PropsWeControl> & Props<Tag>
) {
  const {
    as: El = DEFAULT_TAG,
    variant = "body",
    bold = false,
    semibold = false,
    color = baseColor,
    link = false,
    className,
    ...elProps
  } = props;

  const style = cn(className, variants[variant], color, {
    "font-bold": bold,
    "font-semibold": semibold,
    "hover:text-dark-brand-100": link,
  });

  return <El className={style} {...elProps} />;
}
