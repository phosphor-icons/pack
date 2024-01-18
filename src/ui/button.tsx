import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import * as styles from "@/styles/button.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  link?: boolean;
  text?: boolean;
  active?: boolean;
};

export const Button = (props: ButtonProps) => {
  const { className, text, link, active, ...rest } = props;
  return (
    <button
      className={clsx(className, {
        [styles.basicButton]: !text,
        [styles.textButton]: text,
        [styles.link]: link,
        [styles.active]: active,
      })}
      {...rest}
    />
  );
};
