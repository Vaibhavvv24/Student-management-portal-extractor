import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: 'var(--color-surface-card)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 'var(--radius-control)',
    marginTop: 'var(--space-md)'
  };

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    border: '1px solid var(--color-border-default)',
    borderRadius: 'var(--radius-control)',
    backgroundColor: 'var(--color-surface-card)',
    color: disabled ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    fontSize: '13px',
    fontWeight: 500
  });

  const pageNumStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-control)',
    border: isActive ? '1px solid var(--color-brand-primary)' : '1px solid transparent',
    backgroundColor: isActive ? 'var(--color-brand-primary)' : 'transparent',
    color: isActive ? '#FFFFFF' : 'var(--color-text-primary)',
    fontWeight: isActive ? 600 : 400,
    fontSize: '13px',
    cursor: 'pointer'
  });

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      data-design-component="Pagination"
      data-design-id="c-pagination"
      data-design-hint="pagination"
      data-design-name="Pagination"
      style={containerStyle}
    >
      <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
        Showing <strong style={{ color: 'var(--color-text-primary)' }}>{start}–{end}</strong> of <strong style={{ color: 'var(--color-text-primary)' }}>{totalItems}</strong> students
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          style={btnStyle(currentPage === 1)}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            style={pageNumStyle(p === currentPage)}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          style={btnStyle(currentPage === totalPages)}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

