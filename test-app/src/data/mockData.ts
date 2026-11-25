export interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  status: 'Active' | 'Pending' | 'Inactive';
  avatar: string;
  gpa: number;
  enrollmentDate: string;
  dob: string;
  gender: string;
  nationality: string;
  studentType: string;
  phone: string;
  campusAddress: string;
  emergencyContact: string;
  advisor: string;
  degree: string;
  currentSemester: string;
}

export const STUDENTS_DATA: Student[] = [
  {
    id: 'STU-001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@university.edu',
    department: 'Computer Science',
    year: '3rd Year',
    status: 'Active',
    avatar: 'SJ',
    gpa: 3.85,
    enrollmentDate: 'August 24, 2023',
    dob: 'May 14, 2003',
    gender: 'Female',
    nationality: 'United States',
    studentType: 'Full-time Undergraduate',
    phone: '+1 (555) 234-5678',
    campusAddress: 'Oak Hall Rm 402, North Campus',
    emergencyContact: 'Robert Jenkins (Father) - +1 (555) 987-6543',
    advisor: 'Dr. Alan Turing',
    degree: 'B.S. Software Engineering',
    currentSemester: '5th Semester'
  },
  {
    id: 'STU-002',
    name: 'Marcus Chen',
    email: 'marcus.chen@university.edu',
    department: 'Computer Science',
    year: '4th Year',
    status: 'Active',
    avatar: 'MC',
    gpa: 3.92,
    enrollmentDate: 'August 22, 2022',
    dob: 'October 11, 2002',
    gender: 'Male',
    nationality: 'Canada',
    studentType: 'Full-time Undergraduate',
    phone: '+1 (555) 345-6789',
    campusAddress: 'Pine Tower Rm 102, West Campus',
    emergencyContact: 'Mei Chen (Mother) - +1 (555) 876-5432',
    advisor: 'Dr. Donald Knuth',
    degree: 'B.S. Artificial Intelligence',
    currentSemester: '7th Semester'
  },
  {
    id: 'STU-003',
    name: 'Elena Rostova',
    email: 'elena.rostova@university.edu',
    department: 'Electrical Engineering',
    year: '2nd Year',
    status: 'Active',
    avatar: 'ER',
    gpa: 3.78,
    enrollmentDate: 'August 25, 2024',
    dob: 'January 28, 2004',
    gender: 'Female',
    nationality: 'Germany',
    studentType: 'Full-time Undergraduate',
    phone: '+1 (555) 456-7890',
    campusAddress: 'Elm Court Rm 210, East Campus',
    emergencyContact: 'Viktor Rostov (Father) - +1 (555) 765-4321',
    advisor: 'Dr. Claude Shannon',
    degree: 'B.S. Electrical & Computer Eng.',
    currentSemester: '3rd Semester'
  },
  {
    id: 'STU-004',
    name: 'David Kim',
    email: 'david.kim@university.edu',
    department: 'Mechanical Engineering',
    year: '3rd Year',
    status: 'Pending',
    avatar: 'DK',
    gpa: 3.45,
    enrollmentDate: 'August 23, 2023',
    dob: 'March 19, 2003',
    gender: 'Male',
    nationality: 'South Korea',
    studentType: 'Full-time International',
    phone: '+1 (555) 567-8901',
    campusAddress: 'Maple House Rm 305, South Campus',
    emergencyContact: 'Soo-Jin Kim (Mother) - +1 (555) 654-3210',
    advisor: 'Dr. Nikola Tesla',
    degree: 'B.S. Mechanical Robotics',
    currentSemester: '5th Semester'
  },
  {
    id: 'STU-005',
    name: 'Amara Patel',
    email: 'amara.patel@university.edu',
    department: 'Biotechnology',
    year: '1st Year',
    status: 'Active',
    avatar: 'AP',
    gpa: 3.95,
    enrollmentDate: 'August 26, 2025',
    dob: 'September 5, 2005',
    gender: 'Female',
    nationality: 'United Kingdom',
    studentType: 'Full-time Undergraduate',
    phone: '+1 (555) 678-9012',
    campusAddress: 'Cedar Hall Rm 115, North Campus',
    emergencyContact: 'Rajesh Patel (Father) - +1 (555) 543-2109',
    advisor: 'Dr. Rosalind Franklin',
    degree: 'B.S. Molecular Biotechnology',
    currentSemester: '1st Semester'
  },
  {
    id: 'STU-006',
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@university.edu',
    department: 'Mathematics',
    year: '4th Year',
    status: 'Active',
    avatar: 'LO',
    gpa: 3.88,
    enrollmentDate: 'August 21, 2022',
    dob: 'December 12, 2002',
    gender: 'Male',
    nationality: 'Ireland',
    studentType: 'Full-time Honors',
    phone: '+1 (555) 789-0123',
    campusAddress: 'Birch Hall Rm 204, West Campus',
    emergencyContact: 'Fiona O\'Connor (Mother) - +1 (555) 432-1098',
    advisor: 'Dr. John von Neumann',
    degree: 'B.S. Pure & Applied Mathematics',
    currentSemester: '7th Semester'
  },
  {
    id: 'STU-007',
    name: 'Zoe Washington',
    email: 'zoe.washington@university.edu',
    department: 'Civil Engineering',
    year: '2nd Year',
    status: 'Inactive',
    avatar: 'ZW',
    gpa: 3.12,
    enrollmentDate: 'August 24, 2024',
    dob: 'July 8, 2004',
    gender: 'Female',
    nationality: 'United States',
    studentType: 'Leave of Absence',
    phone: '+1 (555) 890-1234',
    campusAddress: 'Off-campus Residence, Apt 4B',
    emergencyContact: 'Grace Washington (Sister) - +1 (555) 321-0987',
    advisor: 'Dr. Gustave Eiffel',
    degree: 'B.S. Structural Engineering',
    currentSemester: '3rd Semester'
  },
  {
    id: 'STU-008',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@university.edu',
    department: 'Computer Science',
    year: '3rd Year',
    status: 'Active',
    avatar: 'TA',
    gpa: 3.65,
    enrollmentDate: 'August 23, 2023',
    dob: 'November 23, 2003',
    gender: 'Male',
    nationality: 'United Arab Emirates',
    studentType: 'Full-time International',
    phone: '+1 (555) 901-2345',
    campusAddress: 'Willow Court Rm 512, East Campus',
    emergencyContact: 'Khalid Al-Mansoor (Father) - +1 (555) 210-9876',
    advisor: 'Dr. Grace Hopper',
    degree: 'B.S. Cybersecurity',
    currentSemester: '5th Semester'
  },
  {
    id: 'STU-009',
    name: 'Chloe Dubois',
    email: 'chloe.dubois@university.edu',
    department: 'Biotechnology',
    year: '2nd Year',
    status: 'Pending',
    avatar: 'CD',
    gpa: 3.52,
    enrollmentDate: 'August 25, 2024',
    dob: 'April 30, 2004',
    gender: 'Female',
    nationality: 'France',
    studentType: 'Exchange Student',
    phone: '+1 (555) 012-3456',
    campusAddress: 'Global Village Suite 12, West Campus',
    emergencyContact: 'Pierre Dubois (Father) - +33 1 23 45 67 89',
    advisor: 'Dr. Louis Pasteur',
    degree: 'B.S. Bioinformatics',
    currentSemester: '3rd Semester'
  },
  {
    id: 'STU-010',
    name: 'James Wilson',
    email: 'james.wilson@university.edu',
    department: 'Electrical Engineering',
    year: '1st Year',
    status: 'Active',
    avatar: 'JW',
    gpa: 3.71,
    enrollmentDate: 'August 26, 2025',
    dob: 'August 17, 2005',
    gender: 'Male',
    nationality: 'United States',
    studentType: 'Full-time Undergraduate',
    phone: '+1 (555) 123-4560',
    campusAddress: 'Oak Hall Rm 118, North Campus',
    emergencyContact: 'Karen Wilson (Mother) - +1 (555) 678-9011',
    advisor: 'Dr. James Clerk Maxwell',
    degree: 'B.S. Microelectronics',
    currentSemester: '1st Semester'
  },
  {
    id: 'STU-011',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@university.edu',
    department: 'Computer Science',
    year: '4th Year',
    status: 'Active',
    avatar: 'AS',
    gpa: 3.98,
    enrollmentDate: 'August 22, 2022',
    dob: 'February 14, 2002',
    gender: 'Female',
    nationality: 'India',
    studentType: 'Full-time International',
    phone: '+1 (555) 234-5671',
    campusAddress: 'Pine Tower Rm 410, West Campus',
    emergencyContact: 'Sunita Sharma (Mother) - +91 98765 43210',
    advisor: 'Dr. Barbara Liskov',
    degree: 'B.S. Distributed Systems',
    currentSemester: '7th Semester'
  },
  {
    id: 'STU-012',
    name: 'Lucas Silva',
    email: 'lucas.silva@university.edu',
    department: 'Mechanical Engineering',
    year: '3rd Year',
    status: 'Active',
    avatar: 'LS',
    gpa: 3.60,
    enrollmentDate: 'August 23, 2023',
    dob: 'June 29, 2003',
    gender: 'Male',
    nationality: 'Brazil',
    studentType: 'Full-time Undergraduate',
    phone: '+1 (555) 345-6782',
    campusAddress: 'Elm Court Rm 308, East Campus',
    emergencyContact: 'Thiago Silva (Father) - +55 11 9876-5432',
    advisor: 'Dr. Henry Ford',
    degree: 'B.S. Automotive Systems',
    currentSemester: '5th Semester'
  }
];

export const RECENT_ACTIVITIES = [
  { id: 'act-1', student: 'Sarah Jenkins', action: 'Submitted Final Capstone Proposal', time: '12 minutes ago', status: 'Completed' },
  { id: 'act-2', student: 'David Kim', action: 'Requested Course Drop for MATH-302', time: '1 hour ago', status: 'Pending Review' },
  { id: 'act-3', student: 'Amara Patel', action: 'Registered for Spring Semester 2026', time: '3 hours ago', status: 'Approved' },
  { id: 'act-4', student: 'Zoe Washington', action: 'Submitted Medical Leave Documentation', time: '5 hours ago', status: 'Processed' },
  { id: 'act-5', student: 'Marcus Chen', action: 'Awarded Dean\'s Honor List Certificate', time: '1 day ago', status: 'Completed' }
];

export const ENROLLMENT_STATS = [
  { month: 'Sep', count: 1050, label: 'Fall Ingestion' },
  { month: 'Oct', count: 1120, label: 'Regular Session' },
  { month: 'Nov', count: 1190, label: 'Midterm Census' },
  { month: 'Dec', count: 1210, label: 'Winter Session' },
  { month: 'Jan', count: 1248, label: 'Spring Enrolled' }
];

