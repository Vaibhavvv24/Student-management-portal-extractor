import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, BookOpen, Phone, Calendar, Clock, Award } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Breadcrumb } from '../components/Breadcrumb';
import { ProfileCard } from '../components/ProfileCard';
import { InformationCard } from '../components/InformationCard';
import { Tabs } from '../components/Tabs';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { STUDENTS_DATA } from '../data/mockData';

export const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Find student or default to first student
  const student = STUDENTS_DATA.find((s) => s.id === id) || STUDENTS_DATA[0];

  const breadcrumbs = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Students', to: '/students' },
    { label: student.name }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={16} /> },
    { id: 'academic', label: 'Academic History', icon: <BookOpen size={16} /> },
    { id: 'activity', label: 'Activity Log', icon: <Clock size={16} /> }
  ];

  const personalFields = [
    { label: 'Date of Birth', value: student.dob },
    { label: 'Gender', value: student.gender },
    { label: 'Nationality', value: student.nationality },
    { label: 'Student Type', value: student.studentType }
  ];

  const academicFields = [
    { label: 'Department', value: student.department },
    { label: 'Degree Program', value: student.degree },
    { label: 'Current Semester', value: student.currentSemester },
    { label: 'Faculty Advisor', value: student.advisor },
    { label: 'Enrollment Date', value: student.enrollmentDate },
    { label: 'Cumulative GPA', value: `${student.gpa} / 4.00` }
  ];

  const contactFields = [
    { label: 'Email Address', value: student.email },
    { label: 'Phone Number', value: student.phone },
    { label: 'Campus Residence', value: student.campusAddress },
    { label: 'Emergency Contact', value: student.emergencyContact }
  ];

  return (
    <div className="app-shell" data-design-screen="student-details">
      <Sidebar />
      <div className="main-content">
        <Header title="Student Details" subtitle={`Viewing academic record for ${student.name} (${student.id})`} />

        <div className="page-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumb items={breadcrumbs} />
            <Button
              typeVariant="outline"
              size="sm"
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate('/students')}
            >
              Back to Students
            </Button>
          </div>

          {/* Hero Profile Card */}
          <ProfileCard student={student} onEdit={() => setIsEditModalOpen(true)} />

          {/* Navigation Tabs */}
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
              <InformationCard
                title="Personal Information"
                icon={<User size={18} />}
                fields={personalFields}
              />
              <InformationCard
                title="Academic Information"
                icon={<BookOpen size={18} />}
                fields={academicFields}
              />
              <InformationCard
                title="Contact & Emergency"
                icon={<Phone size={18} />}
                fields={contactFields}
              />
            </div>
          )}

          {activeTab === 'academic' && (
            <div
              data-design-component="AcademicRecordCard"
              data-design-id="c-academiccard"
              data-design-hint="card"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-card)',
                padding: 'var(--space-lg)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <h2 className="text-h2" style={{ marginBottom: '16px' }}>Enrolled Courses — Spring 2026</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--color-surface-muted)', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)' }}>CS-401: Advanced Distributed Systems</strong>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Prof. Leslie Lamport • 4 Credits</div>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--color-status-success)' }}>Grade: A (4.0)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--color-surface-muted)', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)' }}>CS-380: Machine Learning & Neural Nets</strong>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Prof. Geoffrey Hinton • 4 Credits</div>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--color-status-success)' }}>Grade: A- (3.7)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--color-surface-muted)', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)' }}>MATH-310: Abstract Algebra & Number Theory</strong>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Prof. Emmy Noether • 3 Credits</div>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--color-status-success)' }}>Grade: A (4.0)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div
              data-design-component="ActivityHistoryCard"
              data-design-id="c-activityhistory"
              data-design-hint="card"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-card)',
                padding: 'var(--space-lg)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <h2 className="text-h2" style={{ marginBottom: '16px' }}>Student Audit & Access Trail</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border-default)' }}>
                  <strong>Course Registration Updated</strong> — Added CS-401 by Student Self-Service (Jan 15, 2026)
                </div>
                <div style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border-default)' }}>
                  <strong>Advising Meeting Recorded</strong> — Reviewed semester audit with Dr. Alan Turing (Dec 12, 2025)
                </div>
                <div style={{ padding: '8px 0' }}>
                  <strong>Dean's Honor List Recognition</strong> — Awarded for Fall 2025 term GPA 3.85 (Jan 05, 2026)
                </div>
              </div>
            </div>
          )}

          {/* Edit Student Modal */}
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title={`Edit Profile: ${student.name}`}
            onConfirm={() => setIsEditModalOpen(false)}
            confirmText="Update Record"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Phone Number</label>
                <Input defaultValue={student.phone} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Campus Address</label>
                <Input defaultValue={student.campusAddress} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Emergency Contact</label>
                <Input defaultValue={student.emergencyContact} />
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

