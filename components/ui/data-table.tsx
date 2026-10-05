import type { ReactNode } from "react";

/**
 * Generic server-rendered data table. No sorting, filtering, or pagination —
 * those come later if needed. Renders `emptyState` when there are no rows.
 */
export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  emptyState: ReactNode;
  rowKey: (row: T) => string;
};

export default function DataTable<T>({
  columns,
  rows,
  emptyState,
  rowKey,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-border last:border-0">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-top text-secondary">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
