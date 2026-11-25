import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: 'var(--font-size-body)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-md)'
  };

  return (
    <nav
      data-design-component="Breadcrumb"
      data-design-id="c-breadcrumb"
      data-design-hint="breadcrumb"
      data-design-name="Breadcrumb"
      style={containerStyle}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight size={16} color="var(--color-text-secondary)" />}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                style={{
                  color: 'var(--color-brand-primary)',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ color: isLast ? 'var(--color-text-primary)' : 'inherit', fontWeight: isLast ? 600 : 400 }}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

