import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Eye, Filter } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { DataTable, Column } from '../components/DataTable';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { Student, STUDENTS_DATA } from '../data/mockData';

export const Students: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filtered = STUDENTS_DATA.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !deptFilter || s.department === deptFilter;
    const matchesStatus = !statusFilter || s.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<Student>[] = [
    {
      header: 'Student',
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar initials={row.avatar} size="sm" name={row.name} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{row.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{row.email}</div>
          </div>
        </div>
      ),
      width: '280px'
    },
    {
      header: 'Student ID',
      accessor: 'id',
      width: '120px'
    },
    {
      header: 'Department',
      accessor: 'department',
      width: '200px'
    },
    {
      header: 'Year',
      accessor: 'year',
      width: '110px'
    },
    {
      header: 'GPA',
      accessor: (row) => (
        <span style={{ fontWeight: 600, color: row.gpa >= 3.8 ? 'var(--color-status-success)' : 'var(--color-text-primary)' }}>
          {row.gpa.toFixed(2)}
        </span>
      ),
      width: '80px',
      align: 'center'
    },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge tone={row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'warning' : 'neutral'}>
          {row.status}
        </Badge>
      ),
      width: '120px',
      align: 'center'
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Button
          typeVariant="outline"
          size="sm"
          icon={<Eye size={14} />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/students/${row.id}`);
          }}
        >
          View
        </Button>
      ),
      width: '100px',
      align: 'right'
    }
  ];

  return (
    <div className="app-shell" data-design-screen="students">
      <Sidebar />
      <div className="main-content">
        <Header title="Student Directory" subtitle="Manage student enrollments, academic profiles and statuses" />

        <div className="page-container">
          {/* Header Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="text-h1" style={{ margin: 0 }}>Student Management</h1>
              <p className="text-secondary" style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                Total {STUDENTS_DATA.length} registered students in University Academic System
              </p>
            </div>
            <Button
              typeVariant="primary"
              size="md"
              icon={<UserPlus size={16} />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Student
            </Button>
          </div>

          {/* Filter & Search Bar */}
          <div
            data-design-component="FilterBar"
            data-design-id="c-filterbar"
            data-design-hint="bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              backgroundColor: 'var(--color-surface-card)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-card)',
              padding: 'var(--space-md)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Search by name, student ID, or university email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={16} />}
              />
            </div>

            <Dropdown
              label="All Departments"
              options={[
                { label: 'Computer Science', value: 'Computer Science' },
                { label: 'Electrical Engineering', value: 'Electrical Engineering' },
                { label: 'Mechanical Engineering', value: 'Mechanical Engineering' },
                { label: 'Biotechnology', value: 'Biotechnology' },
                { label: 'Mathematics', value: 'Mathematics' },
                { label: 'Civil Engineering', value: 'Civil Engineering' }
              ]}
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{ width: '190px' }}
            />

            <Dropdown
              label="All Statuses"
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Inactive', value: 'Inactive' }
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '150px' }}
            />
          </div>

          {/* Student Table */}
          <DataTable
            columns={columns}
            data={paginated}
            onRowClick={(row) => navigate(`/students/${row.id}`)}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />

          {/* Add Student Modal */}
          <Modal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            title="Register New Student"
            onConfirm={() => setIsAddModalOpen(false)}
            confirmText="Create Student"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Full Name</label>
                <Input placeholder="e.g. John Doe" />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>University Email</label>
                <Input placeholder="e.g. john.doe@university.edu" />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Department</label>
                <Dropdown
                  options={[
                    { label: 'Computer Science', value: 'Computer Science' },
                    { label: 'Electrical Engineering', value: 'Electrical Engineering' },
                    { label: 'Mechanical Engineering', value: 'Mechanical Engineering' }
                  ]}
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

