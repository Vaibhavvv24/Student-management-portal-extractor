import React from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, Settings, BookOpen, LogOut } from 'lucide-react';
import { NavItem } from './NavItem';
import { Avatar } from './Avatar';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const sidebarStyle: React.CSSProperties = {
    width: '240px',
    minWidth: '240px',
    backgroundColor: 'var(--color-surface-sidebar)',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 'var(--space-lg) var(--space-md)',
    boxSizing: 'border-box',
    minHeight: '1024px'
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 8px',
    marginBottom: 'var(--space-xl)'
  };

  const navGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const userMenuStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 8px',
    borderTop: '1px solid #312E81',
    marginTop: 'auto'
  };

  return (
    <aside
      data-design-component="Sidebar"
      data-design-id="c-sidebar"
      data-design-hint="sidebar"
      data-design-name="Sidebar"
      style={sidebarStyle}
    >
      <div>
        <div style={logoStyle}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: 'var(--color-brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF'
          }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>EduTrack</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Student Portal</div>
          </div>
        </div>

        <nav style={navGroupStyle}>
          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            isActive={path === '/dashboard' || path === '/'}
          />
          <NavItem
            to="/students"
            icon={<Users size={20} />}
            label="Students"
            isActive={path.startsWith('/students')}
          />
          <NavItem
            to="/courses"
            icon={<BookOpen size={20} />}
            label="Courses"
            isActive={path.startsWith('/courses')}
          />
          <NavItem
            to="/settings"
            icon={<Settings size={20} />}
            label="Settings"
            isActive={path.startsWith('/settings')}
          />
        </nav>
      </div>

      <div style={userMenuStyle}>
        <Avatar initials="PS" size="md" name="Prof. Smith" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Prof. Smith
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8' }}>Faculty Advisor</div>
        </div>
        <LogOut size={16} color="#94A3B8" style={{ cursor: 'pointer' }} />
      </div>
    </aside>
  );
};

