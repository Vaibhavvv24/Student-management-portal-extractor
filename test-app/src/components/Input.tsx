import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'disabled';
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  icon,
  style,
  disabled,
  ...props
}) => {
  const isError = variant === 'error';
  const isDisabled = disabled || variant === 'disabled';

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    backgroundColor: isDisabled ? 'var(--color-surface-muted)' : 'var(--color-surface-card)',
    border: `1px solid ${isError ? 'var(--color-status-danger)' : 'var(--color-border-default)'}`,
    borderRadius: 'var(--radius-control)',
    padding: '0 12px',
    height: '40px',
    boxSizing: 'border-box'
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-body)',
    color: isDisabled ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
    paddingLeft: icon ? '8px' : '0'
  };

  return (
    <div
      data-design-component="Input"
      data-design-variant={JSON.stringify({ state: isDisabled ? 'disabled' : isError ? 'error' : 'default' })}
      data-design-id="c-input"
      data-design-hint="input"
      data-design-name="Input"
      style={{ ...containerStyle, ...style }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)' }}>{icon}</span>}
      <input
        disabled={isDisabled}
        style={inputStyle}
        {...props}
      />
    </div>
  );
};

