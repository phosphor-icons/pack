import { ReactNode, TableHTMLAttributes } from "react";
import { Property } from "csstype";
import * as styles from "#/styles/table.css";
import clsx from "clsx";

type TableCell = TableHTMLAttributes<HTMLTableDataCellElement> & {
  data?: ReactNode;
  span?: number;
  align?: Property.TextAlign;
};

export type TableProps = {
  headings?: TableCell[];
  children?: ReactNode;
  fixed?: boolean;
};

export const Table = (props: TableProps) => {
  return (
    <table className={clsx(styles.table, { [styles.fixed]: props.fixed })}>
      <Table.Head cells={props.headings} />
      <tbody>{props.children}</tbody>
    </table>
  );
};

Table.Head = (props: { cells?: TableCell[] }) => {
  return (
    <thead>
      <tr>
        {props.cells?.map(({ data, span, align, ...td }, i) => (
          <th
            {...td}
            key={i}
            colSpan={span}
            className={styles.td}
            style={align ? { ...td.style, textAlign: align } : undefined}
          >
            {data}
          </th>
        ))}
      </tr>
    </thead>
  );
};

Table.Row = (props: { cells?: TableCell[] }) => {
  return (
    <tr>
      {props.cells?.map(({ data, span, align, ...td }, i) => (
        <td
          {...td}
          key={i}
          colSpan={span}
          className={styles.td}
          style={align ? { ...td.style, textAlign: align } : undefined}
        >
          {data}
        </td>
      ))}
    </tr>
  );
};
