import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  typeVariant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  typeVariant = 'primary',
  size = 'md',
  children,
  icon,
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-family)',
    fontWeight: 500,
    borderRadius: 'var(--radius-control)',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textDecoration: 'none',
    boxSizing: 'border-box'
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '12px', height: '32px' },
    md: { padding: '8px 16px', fontSize: '14px', height: '40px' },
    lg: { padding: '12px 20px', fontSize: '16px', height: '48px' }
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-brand-primary)',
      color: 'var(--color-text-on-brand)',
      borderColor: 'var(--color-brand-primary)'
    },
    secondary: {
      backgroundColor: 'var(--color-surface-muted)',
      color: 'var(--color-text-primary)',
      borderColor: 'var(--color-border-default)'
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-primary)',
      borderColor: 'var(--color-border-default)'
    },
    destructive: {
      backgroundColor: 'var(--color-status-danger)',
      color: 'var(--color-text-on-brand)',
      borderColor: 'var(--color-status-danger)'
    }
  };

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[typeVariant],
    ...style
  };

  return (
    <button
      data-design-component="Button"
      data-design-variant={JSON.stringify({ type: typeVariant, size })}
      data-design-id="c-button"
      data-design-hint="button"
      data-design-name="Button"
      style={combinedStyle}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

