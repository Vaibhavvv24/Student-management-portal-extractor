import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ENROLLMENT_STATS } from '../data/mockData';

export const ChartContainer: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-card)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
    padding: 'var(--space-lg)',
    flex: 2
  };

  const maxVal = 1300;

  return (
    <div
      data-design-component="ChartContainer"
      data-design-id="c-chart"
      data-design-hint="card"
      data-design-name="ChartContainer"
      style={containerStyle}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <div>
          <h2 className="text-h2" style={{ margin: 0 }}>Enrollment Analytics</h2>
          <p className="text-secondary text-label" style={{ margin: '4px 0 0 0' }}>Academic Year 2025–2026 Student Trends</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-brand-primary)' }}>
          <BarChart3 size={20} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Active Census</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '180px', paddingTop: '20px', borderBottom: '1px solid var(--color-border-default)' }}>
        {ENROLLMENT_STATS.map((stat, idx) => {
          const heightPercent = (stat.count / maxVal) * 100;
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '60px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{stat.count}</span>
              <div
                style={{
                  width: '36px',
                  height: `${heightPercent}%`,
                  backgroundColor: idx === ENROLLMENT_STATS.length - 1 ? 'var(--color-brand-primary)' : '#C7D2FE',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease'
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{stat.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

