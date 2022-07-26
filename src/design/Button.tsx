import React from "react";
import cn from "clsx";
import type { PropsOf } from "../utils/react";

const DEFAULT_TAG = "button";

const variants = {
  icon: `
    rounded-xl p-4 border border-dark-gray-50 bg-dark-gray-50 font-bold text-dark-gray-600 hover:text-white
    hover:bg-gradient-to-t hover:from-brand2-start hover:to-brand2-end hover:border-dark-brand-500`,
  base: `
    rounded-xl py-3.5 px-6 bg-gradient-to-t from-brand-start to-brand-end
    text-white font-bold`,
  tiny: `
    rounded-md py-1 px-2 bg-dark-background-300 text-xs font-bold text-dark-gray-600
    border border-dark-background-300 hover:border-dark-brand-500
    hover:bg-gradient-to-t hover:from-brand-start hover:to-brand-end hover:text-white
    active:bg-gradient-to-t active:from-brand2-start active:to-brand2-end hover:text-white
  `,
};

type PropsWeControl = "as" | "variant" | "bold" | "medium" | "color" | "caps";
type Props<T> = {
  as?: T;
  variant?: keyof typeof variants;
  bold?: boolean;
  caps?: boolean;
  medium?: boolean;
  color?: string;
};

/**
 * Placeholder...
 */
export function Button<Tag extends React.ElementType = typeof DEFAULT_TAG>(
  props: Omit<PropsOf<Tag>, PropsWeControl> & Props<Tag>
) {
  const {
    as: El = DEFAULT_TAG,
    bold,
    caps,
    className,
    variant = "base",
    type = "button",
    ...elProps
  } = props;

  const innerType = El === DEFAULT_TAG ? type : undefined;

  const style = cn(className, variants[variant], {
    "font-bold": bold,
    capitalize: caps,
  });

  return <El type={innerType} className={style} {...elProps} />;
}

type OAuthProps = {
  Logo: React.ReactElement;
  children: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function OAuthButton({ Logo, ...props }: OAuthProps) {
  return (
    <button
      {...props}
      className="dark:bg-dark-background-200 flex items-center w-full p-2.5 rounded-md border dark:border-dark-gray-50 dark:hover:bg-dark-background-300"
    >
      {Logo}
      <div className="text-center w-full font-bold text-s">
        {props.children}
      </div>
    </button>
  );
}
