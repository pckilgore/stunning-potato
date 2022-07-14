import React from "react";
import cx from "clsx";

const textVariants = {
  big: "",
  bold: "text-button font-bold dark:text-dark-gray-700",
  caps: "",
  medium: "text-button",
};

/**
 * Placeholder...
 */
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} />;
}

type Props = {
  Logo: React.ReactElement;
  children: string;
};

export function OAuthButton(props: Props) {
  const base =
    "dark:bg-dark-background-200 flex items-center w-full p-2.5 rounded-md border dark:border-dark-gray-50 dark:hover:bg-dark-background-300";

  return (
    <button className={cx(base, textVariants.bold)}>
      {props.Logo}
      <div className="text-center w-full px-px">{props.children}</div>
    </button>
  );
}
