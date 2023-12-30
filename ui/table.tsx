import { ReactNode } from "react";
import { Property } from "csstype";
import * as styles from "#/styles/table.css";

type TableCell = {
  data?: ReactNode;
  span?: number;
  align?: Property.TextAlign;
};

export type TableProps = {
  headings?: TableCell[];
  children?: ReactNode;
};

export const Table = (props: TableProps) => {
  return (
    <table className={styles.table}>
      <Table.Head cells={props.headings} />
      <tbody>{props.children}</tbody>
    </table>
  );
};

Table.Head = (props: { cells?: TableCell[] }) => {
  return (
    <thead>
      <tr>
        {props.cells?.map(({ data, span, align }, i) => (
          <th
            key={i}
            colSpan={span}
            className={styles.td}
            style={align ? { textAlign: align } : undefined}
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
      {props.cells?.map(({ data, span, align }, i) => (
        <td
          key={i}
          colSpan={span}
          className={styles.td}
          style={align ? { textAlign: align } : undefined}
        >
          {data}
        </td>
      ))}
    </tr>
  );
};
