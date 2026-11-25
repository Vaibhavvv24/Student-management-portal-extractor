import React from 'react';
import { Badge } from './Badge';

export interface ActivityItemProps {
  student: string;
  action: string;
  time: string;
  status: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ student, action, time, status }) => {
  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid var(--color-border-default)'
  };

  return (
    <div
      data-design-component="ActivityItem"
      data-design-id="c-activityitem"
      data-design-hint="item"
      data-design-name="ActivityItem"
      style={itemStyle}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-primary)' }}>{student}</div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{action}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{time}</span>
        <Badge tone={status === 'Completed' || status === 'Approved' ? 'success' : 'warning'}>
          {status}
        </Badge>
      </div>
    </div>
  );
};

