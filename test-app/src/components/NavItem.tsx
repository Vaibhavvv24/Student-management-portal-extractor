import React from 'react';
import { Link } from 'react-router-dom';

export interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive = false }) => {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: 'var(--radius-control)',
    textDecoration: 'none',
    backgroundColor: isActive ? '#312E81' : 'transparent',
    color: isActive ? '#FFFFFF' : '#C7D2FE',
    fontSize: '14px',
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box',
    width: '100%'
  };

  return (
    <Link
      to={to}
      data-design-component="NavItem"
      data-design-variant={JSON.stringify({ state: isActive ? 'active' : 'default' })}
      data-design-id="c-navitem"
      data-design-hint="link"
      data-design-name="NavItem"
      style={style}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

