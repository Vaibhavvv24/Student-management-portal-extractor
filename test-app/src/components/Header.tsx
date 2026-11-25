import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Avatar } from './Avatar';
import { Input } from './Input';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '72px',
    padding: '0 var(--space-xl)',
    backgroundColor: 'var(--color-surface-card)',
    borderBottom: '1px solid var(--color-border-default)',
    boxSizing: 'border-box'
  };

  const actionGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)'
  };

  return (
    <header
      data-design-component="Header"
      data-design-id="c-header"
      data-design-hint="header"
      data-design-name="Header"
      style={headerStyle}
    >
      <div>
        {title && <h1 className="text-h2" style={{ margin: 0 }}>{title}</h1>}
        {subtitle && <p className="text-secondary text-label" style={{ margin: 0 }}>{subtitle}</p>}
      </div>

      <div style={actionGroupStyle}>
        <div style={{ width: '280px' }}>
          <Input
            placeholder="Search students, courses..."
            icon={<Search size={16} />}
          />
        </div>

        <button
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            borderRadius: 'var(--radius-control)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-text-secondary)',
            position: 'relative'
          }}
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand-primary)'
            }}
          />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid var(--color-border-default)', paddingLeft: '16px' }}>
          <Avatar initials="PS" size="sm" name="Prof. Smith" />
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Prof. Smith</span>
        </div>
      </div>
    </header>
  );
};

