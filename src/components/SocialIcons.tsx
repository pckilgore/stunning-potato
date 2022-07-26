import React from "react";
import cn from "clsx";
import googleUrl from "../../img/icon/Google.svg";
import appleUrl from "../../img/icon/Apple.svg";

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src">;

export function Google(props: Props) {
  const className = cn(props.className, "h-5", "w-5");
  return <img {...props} src={googleUrl} className={className} alt="Google" />;
}

export function Apple(props: Props) {
  const className = cn(props.className, "h-5", "w-5");
  return <img {...props} src={appleUrl} className={className} alt="Google" />;
}
