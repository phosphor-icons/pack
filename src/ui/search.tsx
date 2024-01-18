import { useRef, InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import * as styles from "@/styles/search.css";

export type SearchProps = InputHTMLAttributes<HTMLInputElement> & {
  adornment?: ReactNode;
};

export const Search = (props: SearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { className, type = "search", adornment, ...rest } = props;
  return (
    <div className={styles.search} onClick={() => inputRef.current?.focus()}>
      {adornment}
      <input
        ref={inputRef}
        className={clsx(className, styles.input, {})}
        type={type}
        {...rest}
      />
    </div>
  );
};
