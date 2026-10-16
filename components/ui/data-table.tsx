import type { ReactNode } from "react";
export type DataTableColumn<T> = { key: string; header: string; render: (row: T) => ReactNode };
export type DataTableProps<T> = { columns: DataTableColumn<T>[]; rows: T[]; emptyState: ReactNode; rowKey: (row: T) => string };
export default function DataTable<T>({ columns, rows, emptyState, rowKey }: DataTableProps<T>) {
  if (rows.length === 0) { return <>{emptyState}</>; }
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (<th key={col.key} scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-foreground">{col.header}</th>))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-border last:border-0">
              {columns.map((col) => (<td key={col.key} className="px-4 py-3 align-top text-foreground">{col.render(row)}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
