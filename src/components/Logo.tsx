import React from "react";
import cn from "clsx";
import imgUrl from "../../img/icon/Logo.svg";

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src">;

export function Logo(props: Props) {
  const className = cn(props.className, "h-12", "w-12");
  return <img {...props} src={imgUrl} className={className} alt="Clouty" />;
}
