import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string }>({ columns, data, onRowClick }: DataTableProps<T>) {
  const containerStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-card)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
    overflow: 'hidden',
    width: '100%'
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  };

  const thStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-muted)',
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-table)',
    fontWeight: 'var(--font-weight-table)',
    padding: '12px 16px',
    borderBottom: '1px solid var(--color-border-default)',
    letterSpacing: '0.4px',
    textTransform: 'uppercase'
  };

  return (
    <div
      data-design-component="DataTable"
      data-design-id="c-datatable"
      data-design-hint="table"
      data-design-name="DataTable"
      style={containerStyle}
    >
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={{ ...thStyle, width: col.width, textAlign: col.align || 'left' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick && onRowClick(row)}
              data-design-component="TableRow"
              data-design-id="c-tablerow"
              data-design-hint="tablerow"
              data-design-name="TableRow"
              style={{
                borderBottom: '1px solid var(--color-border-default)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color 0.15s ease'
              }}
            >
              {columns.map((col, cIdx) => (
                <td
                  key={cIdx}
                  style={{
                    padding: '14px 16px',
                    fontSize: 'var(--font-size-body)',
                    color: 'var(--color-text-primary)',
                    textAlign: col.align || 'left',
                    verticalAlign: 'middle'
                  }}
                >
                  {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as any)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

