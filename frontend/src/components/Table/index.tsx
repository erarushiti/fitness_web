'use client';

import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export default function DataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto shadow rounded-lg border border-gray-200">
      <table className="min-w-full bg-white table-auto">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-800 whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className="text-center text-gray-500 py-4"
              >
                No records found.
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 border-b">
                {columns.map((col) => (
                  <td
                    key={String(col.accessor)}
                    className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                  >
                    {col.render ? col.render(item) : (item[col.accessor] as any)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
