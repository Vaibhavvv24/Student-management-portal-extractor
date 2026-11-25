import React from 'react';

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'filter';
  label?: string;
  options: { label: string; value: string }[];
}

export const Dropdown: React.FC<DropdownProps> = ({
  variant = 'default',
  label,
  options,
  style,
  ...props
}) => {
  const selectStyle: React.CSSProperties = {
    height: '40px',
    padding: '0 16px',
    backgroundColor: 'var(--color-surface-card)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 'var(--radius-control)',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-body)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
    ...style
  };

  return (
    <select
      data-design-component="Dropdown"
      data-design-variant={JSON.stringify({ variant })}
      data-design-id="c-dropdown"
      data-design-hint="dropdown"
      data-design-name="Dropdown"
      style={selectStyle}
      {...props}
    >
      {label && <option value="">{label}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

