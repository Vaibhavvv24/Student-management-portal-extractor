import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    borderBottom: '1px solid var(--color-border-default)',
    marginBottom: 'var(--space-lg)',
    width: '100%'
  };

  return (
    <div
      data-design-component="Tabs"
      data-design-id="c-tabs"
      data-design-hint="tabs"
      data-design-name="Tabs"
      style={containerStyle}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            data-design-component="Tab"
            data-design-variant={JSON.stringify({ state: isActive ? 'active' : 'inactive' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 4px',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid var(--color-brand-primary)' : '2px solid transparent',
              color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              fontWeight: isActive ? 600 : 500,
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '-1px',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

