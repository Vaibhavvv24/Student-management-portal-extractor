import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, GraduationCap, Clock, UserPlus, Download, Calendar } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { ChartContainer } from '../components/ChartContainer';
import { ActivityItem } from '../components/ActivityItem';
import { QuickActionButton } from '../components/QuickActionButton';
import { RECENT_ACTIVITIES } from '../data/mockData';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="app-shell" data-design-screen="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header title="Faculty Dashboard" subtitle="Overview of enrollment, academic progress and student activities" />

        <div className="page-container">
          {/* Welcome Banner */}
          <div
            data-design-component="WelcomeSection"
            data-design-id="c-welcome"
            data-design-hint="section"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--color-surface-card)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-card)',
              padding: 'var(--space-lg)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div>
              <h1 className="text-h1" style={{ margin: 0, fontSize: '24px' }}>Welcome back, Professor Smith</h1>
              <p className="text-secondary" style={{ margin: '6px 0 0 0', fontSize: '14px' }}>
                Academic Year 2025–2026 • Computer Science & Engineering Division
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <QuickActionButton
                label="Manage Students"
                icon={<Users size={18} />}
                onClick={() => navigate('/students')}
              />
            </div>
          </div>

          {/* 4 Statistic Cards */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <StatCard
              title="Total Students"
              value="1,248"
              change="+12% from last term"
              tone="primary"
              icon={<Users size={20} />}
            />
            <StatCard
              title="Active Students"
              value="1,120"
              change="89.7% active attendance"
              tone="success"
              icon={<UserCheck size={20} />}
            />
            <StatCard
              title="Graduated Students"
              value="486"
              change="Class of 2025 completed"
              tone="neutral"
              icon={<GraduationCap size={20} />}
            />
            <StatCard
              title="Pending Applications"
              value="42"
              change="Requires dean approval"
              tone="warning"
              icon={<Clock size={20} />}
            />
          </div>

          {/* Analytics Chart & Recent Activity Grid */}
          <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'stretch' }}>
            <ChartContainer />

            <div
              data-design-component="ActivityList"
              data-design-id="c-activitylist"
              data-design-hint="card"
              style={{
                flex: 1,
                backgroundColor: 'var(--color-surface-card)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-card)',
                padding: 'var(--space-lg)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <h2 className="text-h2" style={{ margin: 0, fontSize: '16px' }}>Recent Student Activity</h2>
                <span style={{ fontSize: '12px', color: 'var(--color-brand-primary)', fontWeight: 600, cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {RECENT_ACTIVITIES.map((act) => (
                  <ActivityItem
                    key={act.id}
                    student={act.student}
                    action={act.action}
                    time={act.time}
                    status={act.status}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div>
            <h2 className="text-h2" style={{ fontSize: '16px', marginBottom: 'var(--space-md)' }}>Quick Actions</h2>
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <QuickActionButton
                label="Add New Student Record"
                icon={<UserPlus size={18} />}
                onClick={() => navigate('/students')}
              />
              <QuickActionButton
                label="Export Student Roster (CSV)"
                icon={<Download size={18} />}
              />
              <QuickActionButton
                label="Schedule Academic Review"
                icon={<Calendar size={18} />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

