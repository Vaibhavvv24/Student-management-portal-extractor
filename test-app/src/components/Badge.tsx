import React from 'react';

export interface BadgeProps {
  tone?: 'success' | 'warning' | 'error' | 'neutral';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', children }) => {
  const toneStyles: Record<string, React.CSSProperties> = {
    success: {
      backgroundColor: 'var(--color-status-success-bg)',
      color: 'var(--color-status-success)'
    },
    warning: {
      backgroundColor: 'var(--color-status-warning-bg)',
      color: 'var(--color-status-warning)'
    },
    error: {
      backgroundColor: 'var(--color-status-danger-bg)',
      color: 'var(--color-status-danger)'
    },
    neutral: {
      backgroundColor: 'var(--color-status-neutral-bg)',
      color: 'var(--color-status-neutral)'
    }
  };

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    ...toneStyles[tone]
  };

  return (
    <span
      data-design-component="Badge"
      data-design-variant={JSON.stringify({ tone })}
      data-design-id="c-badge"
      data-design-hint="badge"
      data-design-name="Badge"
      style={style}
    >
      {children}
    </span>
  );
};

