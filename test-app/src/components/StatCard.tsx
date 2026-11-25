import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  tone?: 'primary' | 'success' | 'warning' | 'neutral';
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  tone = 'primary',
  icon
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-card)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
    padding: 'var(--space-lg)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    minWidth: '220px'
  };

  const toneColorMap = {
    primary: 'var(--color-brand-primary)',
    success: 'var(--color-status-success)',
    warning: 'var(--color-status-warning)',
    neutral: 'var(--color-text-secondary)'
  };

  return (
    <div
      data-design-component="StatCard"
      data-design-variant={JSON.stringify({ tone })}
      data-design-id="c-statcard"
      data-design-hint="card"
      data-design-name="StatCard"
      style={cardStyle}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
        <span style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          {title}
        </span>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-control)',
          backgroundColor: 'var(--color-surface-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: toneColorMap[tone]
        }}>
          {icon}
        </div>
      </div>
      <div>
        <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
          {value}
        </div>
        {change && (
          <div style={{ fontSize: 'var(--font-size-label)', color: toneColorMap[tone], marginTop: '6px', fontWeight: 500 }}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
};

