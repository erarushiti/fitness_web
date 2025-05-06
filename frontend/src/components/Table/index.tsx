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
    <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="px-4 py-2 text-left text-base font-medium text-black"
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-2 text-left text-base font-medium text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.accessor)} className="px-4 py-2 text-base text-black">
                  {col.render ? col.render(item) : (item[col.accessor] as any)}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-2 space-x-2">
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
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center text-gray-500 py-4"
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
