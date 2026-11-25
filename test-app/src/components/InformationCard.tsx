import React from 'react';

export interface InfoField {
  label: string;
  value: React.ReactNode;
}

export interface InformationCardProps {
  title: string;
  fields: InfoField[];
  icon?: React.ReactNode;
}

export const InformationCard: React.FC<InformationCardProps> = ({ title, fields, icon }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-card)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
    padding: 'var(--space-lg)',
    flex: 1,
    minWidth: '280px'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: 'var(--space-md)',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--color-border-default)'
  };

  return (
    <div
      data-design-component="InformationCard"
      data-design-id="c-infocard"
      data-design-hint="card"
      data-design-name="InformationCard"
      style={cardStyle}
    >
      <div style={headerStyle}>
        {icon && <span style={{ color: 'var(--color-brand-primary)', display: 'flex' }}>{icon}</span>}
        <h2 className="text-h2" style={{ margin: 0, fontSize: '16px' }}>{title}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {fields.map((field, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>{field.label}</span>
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500, textAlign: 'right' }}>
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

