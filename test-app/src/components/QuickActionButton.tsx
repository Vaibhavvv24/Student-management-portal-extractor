import React from 'react';

export interface QuickActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({ label, icon, onClick }) => {
  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'var(--color-surface-card)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 'var(--radius-control)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-body)',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.15s ease',
    flex: 1
  };

  return (
    <button
      data-design-component="QuickActionButton"
      data-design-id="c-quickaction"
      data-design-hint="button"
      data-design-name="QuickActionButton"
      style={style}
      onClick={onClick}
    >
      <span style={{ color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

