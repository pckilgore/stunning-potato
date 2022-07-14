import React from "react";
import { clsx } from "clsx";
import imgUrl from "../../img/icon/Logo.svg";

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src">;

export function Logo(props: Props) {
  let className = clsx(props.className, "h-12", "w-12");
  return <img {...props} src={imgUrl} className={className} alt="Clouty" />;
}
