import React from 'react';

export interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  name?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, size = 'md', name }) => {
  const sizeMap = {
    sm: { width: 32, height: 32, fontSize: 12 },
    md: { width: 40, height: 40, fontSize: 14 },
    lg: { width: 64, height: 64, fontSize: 20 }
  };

  const dimensions = sizeMap[size];

  const style: React.CSSProperties = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    borderRadius: 'var(--radius-full)',
    backgroundColor: '#EEF2FF',
    color: 'var(--color-brand-primary)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: `${dimensions.fontSize}px`,
    flexShrink: 0,
    userSelect: 'none'
  };

  return (
    <div
      data-design-component="Avatar"
      data-design-variant={JSON.stringify({ size })}
      data-design-id="c-avatar"
      data-design-hint="avatar"
      data-design-name="Avatar"
      style={style}
      title={name || initials}
    >
      {initials}
    </div>
  );
};

