import React from 'react';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Button } from './Button';
import { Edit, Mail, Calendar, Award } from 'lucide-react';
import { Student } from '../data/mockData';

export interface ProfileCardProps {
  student: Student;
  onEdit?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ student, onEdit }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-card)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
    padding: 'var(--space-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-lg)'
  };

  return (
    <div
      data-design-component="ProfileCard"
      data-design-id="c-profilecard"
      data-design-hint="card"
      data-design-name="ProfileCard"
      style={cardStyle}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
        <Avatar initials={student.avatar} size="lg" name={student.name} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 className="text-h1" style={{ margin: 0, fontSize: '24px' }}>{student.name}</h1>
            <Badge tone={student.status === 'Active' ? 'success' : student.status === 'Pending' ? 'warning' : 'neutral'}>
              {student.status}
            </Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            <span>ID: <strong style={{ color: 'var(--color-text-primary)' }}>{student.id}</strong></span>
            <span>Department: <strong style={{ color: 'var(--color-text-primary)' }}>{student.department}</strong></span>
            <span>Year: <strong style={{ color: 'var(--color-text-primary)' }}>{student.year}</strong></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={16} color="var(--color-status-success)" /> GPA: <strong style={{ color: 'var(--color-status-success)' }}>{student.gpa}</strong>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Button
          typeVariant="secondary"
          size="md"
          icon={<Mail size={16} />}
        >
          Message
        </Button>
        <Button
          typeVariant="primary"
          size="md"
          icon={<Edit size={16} />}
          onClick={onEdit}
        >
          Edit Student
        </Button>
      </div>
    </div>
  );
};

