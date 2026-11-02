// ================================================================
// MAIN BLOCK ARCHITECTURAL SPATIAL DATA MODEL
// Exact 4-Level Academic & Administrative Blueprint (G, 1, 2, 3)
// Configured according to campus architectural blueprint:
// - Central Open-to-sky Atrium: "Open top"
// - Surrounding Green Walkway Corridors (North, South, East, West)
// - Ground Floor: Board Room, Chairman Suite, Lounge, Depts, Exam Sec, Action Sec, Classes
// - 1st Floor: Full top row LABS (from Dept to Chairman Lounge), Classrooms & Hardware Labs
// - 2nd Floor: Department Offices (CSE & CSM HOD, Staff Suites, Cabins & Dept Library)
// - 3rd Floor: Big Classes (High-Capacity Tiered Lecture Halls & Presentation Arena)
// ================================================================

export const MAIN_BLOCK_FLOORS = [
  {
    id: 'G',
    numericLevel: 0,
    label: 'Ground Floor',
    shortLabel: 'G',
    code: 'LEVEL-00',
    subtitle: 'Administrative Directorate, Executive Board Room, Chairman Suite & Exam Section',
    wingSummary: 'Board Room & Chairman North · Exam & Action Section South · Central Open Courtyard',
    roomCount: 15,
  },
  {
    id: '1',
    numericLevel: 1,
    label: 'First Floor',
    shortLabel: '1',
    code: 'LEVEL-01',
    subtitle: 'Central Engineering Laboratories Wing, Seminar Hall & Skill Development Directorate',
    wingSummary: 'Full North Lab Bar · West Seminar Hall · East 3 Classes · South Skill & Dept Sections',
    roomCount: 12,
  },
  {
    id: '2',
    numericLevel: 2,
    label: 'Second Floor',
    shortLabel: '2',
    code: 'LEVEL-02',
    subtitle: 'Department Directorate, HOD Offices, Faculty Workstations & Dept Library',
    wingSummary: 'CSE & CSM Department Directorate North · Seminar Hall & Classrooms South',
    roomCount: 15,
  },
  {
    id: '3',
    numericLevel: 3,
    label: 'Third Floor',
    shortLabel: '3',
    code: 'LEVEL-03',
    subtitle: 'Big Classes Wing, Smart Lecture Theatres & Capstone Presentation Arena',
    wingSummary: 'Tiered Big Lecture Theatres North · Grand Auditorium & Innovation Hall South',
    roomCount: 15,
  },
];

export const ROOM_TYPE_CONFIG = {
  administrative: {
    label: 'Administrative',
    color: '#FF5C67',
    bgColor: 'rgba(255, 92, 103, 0.12)',
    borderColor: 'rgba(255, 92, 103, 0.35)',
    accentBg: 'rgba(255, 92, 103, 0.22)',
    icon: 'Shield',
  },
  classroom: {
    label: 'Classroom',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.35)',
    accentBg: 'rgba(59, 130, 246, 0.22)',
    icon: 'GraduationCap',
  },
  laboratory: {
    label: 'Laboratory',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    accentBg: 'rgba(16, 185, 129, 0.22)',
    icon: 'Flask',
  },
  seminar: {
    label: 'Seminar Hall',
    color: '#A855F7',
    bgColor: 'rgba(168, 85, 247, 0.12)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
    accentBg: 'rgba(168, 85, 247, 0.22)',
    icon: 'Tv',
  },
  facility: {
    label: 'Facility',
    color: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.35)',
    accentBg: 'rgba(6, 182, 212, 0.22)',
    icon: 'Droplets',
  },
  transit: {
    label: 'Vertical Transit',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    accentBg: 'rgba(245, 158, 11, 0.22)',
    icon: 'Compass',
  },
};

export const MAIN_BLOCK_ROOMS = [
  // ==============================================================
  // GROUND FLOOR (G)
  // Blueprint Layout from Hand-Drawn Blueprint:
  // Top Row: Corner, Dept, Dept, Boardroom, Chairman, Lounge
  // Left: Class, Class
  // Right: Class, Class
  // Bottom: Exam Section, Action Section, Class
  // ==============================================================
  {
    id: 'mb-g-corner',
    floor: 'G',
    code: 'G-00',
    number: 'G-00',
    name: 'Faculty & Administrative Corner Suite',
    shortName: 'Corner Suite',
    type: 'administrative',
    category: 'Administrative',
    department: 'Administrative Directorate',
    capacity: 15,
    status: 'Operational',
    wing: 'North-West Corner',
    description: 'Executive corner suite providing administrative coordination and faculty briefing.',
    rect: { x: 40, y: 30, w: 140, h: 80 },
  },
  {
    id: 'mb-g-dept-1',
    floor: 'G',
    code: 'G-01',
    number: 'G-01',
    name: 'Academic Department Office 1',
    shortName: 'Dept Office 1',
    type: 'administrative',
    category: 'Administrative',
    department: 'Academic Affairs',
    capacity: 20,
    status: 'Operational',
    wing: 'North Core',
    description: 'First department administration desk for student records, attendance, and faculty coordination.',
    rect: { x: 185, y: 30, w: 105, h: 80 },
  },
  {
    id: 'mb-g-dept-2',
    floor: 'G',
    code: 'G-02',
    number: 'G-02',
    name: 'Academic Department Office 2',
    shortName: 'Dept Office 2',
    type: 'administrative',
    category: 'Administrative',
    department: 'Student Affairs',
    capacity: 20,
    status: 'Operational',
    wing: 'North Core',
    description: 'Second department office handling admissions, certifications, and academic counselling.',
    rect: { x: 295, y: 30, w: 115, h: 80 },
  },
  {
    id: 'mb-g-board',
    floor: 'G',
    code: 'G-03',
    number: 'G-03',
    name: 'Executive Board Room (Ground Only)',
    shortName: 'Board Room',
    type: 'administrative',
    category: 'Administrative',
    department: 'College Governance & Board of Trustees',
    capacity: 34,
    status: 'In Session',
    wing: 'North Central',
    description: 'Premier institutional governance chamber. Present strictly on the Ground Floor only.',
    rect: { x: 415, y: 30, w: 180, h: 80 },
  },
  {
    id: 'mb-g-chairman',
    floor: 'G',
    code: 'G-04',
    number: 'G-04',
    name: "Chairman's Executive Office",
    shortName: 'Chairman Room',
    type: 'administrative',
    category: 'Administrative',
    department: 'Office of the Chairman',
    capacity: 12,
    status: 'Operational',
    wing: 'North-East Core',
    description: 'Executive office suite of the College Chairman with conference anteroom.',
    rect: { x: 600, y: 30, w: 140, h: 80 },
  },
  {
    id: 'mb-g-lounge',
    floor: 'G',
    code: 'G-05',
    number: 'G-05',
    name: "Chairman's Executive Lounge",
    shortName: 'Chairman Lounge',
    type: 'administrative',
    category: 'Administrative',
    department: 'Directorate Reception',
    capacity: 16,
    status: 'Available',
    wing: 'North-East Wing',
    description: 'Private meeting lounge adjoining the Chairman executive office for VIP delegations.',
    rect: { x: 745, y: 30, w: 175, h: 80 },
  },
  {
    id: 'mb-g-class-1',
    floor: 'G',
    code: 'G-06',
    number: 'G-06',
    name: 'Classroom G-06 (West Wing)',
    shortName: 'Classroom G-06',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 65,
    status: 'In Session',
    wing: 'West Wing',
    description: 'Ground floor smart lecture classroom equipped with digital projector & Wi-Fi.',
    rect: { x: 40, y: 155, w: 200, h: 100 },
  },
  {
    id: 'mb-g-class-2',
    floor: 'G',
    code: 'G-07',
    number: 'G-07',
    name: 'Classroom G-07 (West Wing)',
    shortName: 'Classroom G-07',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 65,
    status: 'Available',
    wing: 'West Wing',
    description: 'Ground floor lecture classroom with full audio-visual capability.',
    rect: { x: 40, y: 265, w: 200, h: 100 },
  },
  {
    id: 'mb-g-class-3',
    floor: 'G',
    code: 'G-08',
    number: 'G-08',
    name: 'Classroom G-08 (East Wing)',
    shortName: 'Classroom G-08',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & CSM',
    capacity: 65,
    status: 'Available',
    wing: 'East Wing',
    description: 'Ground floor lecture hall along East corridor concourse.',
    rect: { x: 720, y: 155, w: 200, h: 100 },
  },
  {
    id: 'mb-g-class-4',
    floor: 'G',
    code: 'G-09',
    number: 'G-09',
    name: 'Classroom G-09 (East Wing)',
    shortName: 'Classroom G-09',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & CSM',
    capacity: 65,
    status: 'In Session',
    wing: 'East Wing',
    description: 'East wing smart lecture room for engineering sections.',
    rect: { x: 720, y: 265, w: 200, h: 100 },
  },
  {
    id: 'mb-g-exam',
    floor: 'G',
    code: 'G-10',
    number: 'G-10',
    name: 'Central Examination Section',
    shortName: 'Exam Section',
    type: 'administrative',
    category: 'Administrative',
    department: 'Controller of Examinations',
    capacity: 40,
    status: 'Operational',
    wing: 'South-West Core',
    description: 'Primary institutional examination wing, hall ticket verification & confidential evaluation center.',
    rect: { x: 40, y: 410, w: 395, h: 100 },
  },
  {
    id: 'mb-g-action',
    floor: 'G',
    code: 'G-11',
    number: 'G-11',
    name: 'Action Section & Student Administration',
    shortName: 'Action Section',
    type: 'administrative',
    category: 'Administrative',
    department: 'Administrative Affairs',
    capacity: 25,
    status: 'Operational',
    wing: 'South Core',
    description: 'Student action center, grievance desk, and scholarship documentation.',
    rect: { x: 520, y: 410, w: 200, h: 100 },
  },
  {
    id: 'mb-g-class-5',
    floor: 'G',
    code: 'G-12',
    number: 'G-12',
    name: 'Classroom G-12 (South-East)',
    shortName: 'Classroom G-12',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 65,
    status: 'Available',
    wing: 'South-East Core',
    description: 'Classroom suite beside action section on the South concourse.',
    rect: { x: 730, y: 410, w: 190, h: 100 },
  },
  {
    id: 'mb-g-stairs-n',
    floor: 'G',
    code: 'ST-N',
    number: 'ST',
    name: 'Staircase',
    shortName: 'Staircase',
    type: 'transit',
    category: 'Vertical Transit',
    department: 'Building Transit',
    capacity: null,
    status: 'Operational',
    wing: 'Courtyard North Edge',
    description: 'Staircase situated inside the Open Top courtyard connecting Ground Floor to 1st, 2nd, and 3rd floors.',
    rect: { x: 445, y: 155, w: 70, h: 42 },
  },
  {
    id: 'mb-g-stairs-s',
    floor: 'G',
    code: 'ST-S',
    number: 'ST',
    name: 'Staircase',
    shortName: 'Staircase',
    type: 'transit',
    category: 'Vertical Transit',
    department: 'Building Transit',
    capacity: null,
    status: 'Operational',
    wing: 'Courtyard South Edge',
    description: 'Staircase situated inside the Open Top courtyard connecting Ground to 1st, 2nd, and 3rd floors.',
    rect: { x: 445, y: 323, w: 70, h: 42 },
  },

  // ==============================================================
  // FIRST FLOOR (1)
  // Blueprint Architectural Configuration:
  // - South-West: Classroom 103 (circled) & Classroom 104 (left side of 103)
  // - West Wing: Seminar Hall 105
  // - North Full Bar: Central Systems & Computing Lab 106
  // - East Wing: Classroom 107, Classroom 108, Classroom 109
  // - South-East: Classroom 110
  // - South Core: Dept Section & Skill Dev Section (leave classroom numbers)
  // - Staircases: North (ST-N) and South (ST-S) placed inside Open Top
  // ==============================================================
  {
    id: 'mb-1-class-104',
    floor: '1',
    code: '104',
    number: '104',
    name: 'Classroom 104 (South-West Corner)',
    shortName: 'Classroom 104',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 65,
    status: 'In Session',
    wing: 'South-West Wing',
    description: 'Smart lecture classroom 104 situated on the left side of room 103 along the South-West concourse.',
    rect: { x: 40, y: 410, w: 195, h: 100 },
  },
  {
    id: 'mb-1-class-103',
    floor: '1',
    code: '103',
    number: '103',
    name: 'Classroom 103 (South-West)',
    shortName: 'Classroom 103',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 65,
    status: 'Available',
    wing: 'South-West Wing',
    description: 'Circled smart lecture room 103 situated on the South-West concourse beside the entrance walkway.',
    rect: { x: 240, y: 410, w: 195, h: 100 },
  },
  {
    id: 'mb-1-seminar',
    floor: '1',
    code: '105',
    number: '105',
    name: 'Main Block Academic Seminar Hall (105)',
    shortName: 'Seminar Hall 105',
    type: 'seminar',
    category: 'Seminar Hall',
    department: 'Academic Directorate',
    capacity: 150,
    status: 'Available',
    wing: 'West Full Wing',
    description: 'Auditorium-style tiered seminar hall for department symposia, guest lectures, and academic presentations.',
    rect: { x: 40, y: 155, w: 200, h: 210 },
  },
  {
    id: 'mb-1-lab-106',
    floor: '1',
    code: '106',
    number: '106',
    name: 'Central Engineering Computing & Advanced Systems Laboratory',
    shortName: 'Central Systems & Computing Lab',
    type: 'laboratory',
    category: 'Laboratory',
    department: 'Computer Science & Engineering',
    capacity: 160,
    status: 'Operational',
    wing: 'North Full Wing',
    description: 'Grand continuous engineering and computing laboratory spanning the entire North wing with high-performance workstations, IoT testbenches, and research systems.',
    rect: { x: 40, y: 30, w: 880, h: 80 },
  },
  {
    id: 'mb-1-class-107',
    floor: '1',
    code: '107',
    number: '107',
    name: 'Classroom 107 (East Wing)',
    shortName: 'Classroom 107',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & CSM',
    capacity: 60,
    status: 'In Session',
    wing: 'East Wing',
    description: 'East wing smart lecture room with digital multimedia projection.',
    rect: { x: 720, y: 155, w: 200, h: 67 },
  },
  {
    id: 'mb-1-class-108',
    floor: '1',
    code: '108',
    number: '108',
    name: 'Classroom 108 (East Wing)',
    shortName: 'Classroom 108',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & CSM',
    capacity: 60,
    status: 'Available',
    wing: 'East Wing',
    description: 'East wing lecture hall for technical classes.',
    rect: { x: 720, y: 226, w: 200, h: 67 },
  },
  {
    id: 'mb-1-class-109',
    floor: '1',
    code: '109',
    number: '109',
    name: 'Classroom 109 (East Wing)',
    shortName: 'Classroom 109',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & CSM',
    capacity: 60,
    status: 'In Session',
    wing: 'East Wing',
    description: 'East wing smart lecture room for engineering sections.',
    rect: { x: 720, y: 298, w: 200, h: 67 },
  },
  {
    id: 'mb-1-class-110',
    floor: '1',
    code: '110',
    number: '110',
    name: 'Classroom 110 (South-East)',
    shortName: 'Classroom 110',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 65,
    status: 'Available',
    wing: 'South-East Core',
    description: 'South-East smart classroom adjoining the skill development section.',
    rect: { x: 800, y: 410, w: 120, h: 100 },
  },
  {
    id: 'mb-1-dept-sec',
    floor: '1',
    code: 'DEPT-SEC',
    number: 'DEPT',
    name: 'Department Academic Section',
    shortName: 'Dept Section',
    type: 'administrative',
    category: 'Administrative',
    department: 'Academic & Department Affairs',
    capacity: 25,
    status: 'Operational',
    wing: 'South Core',
    description: 'Department administration section handling academic records, faculty counseling, and student coordination.',
    rect: { x: 520, y: 410, w: 125, h: 100 },
  },
  {
    id: 'mb-1-skill-sec',
    floor: '1',
    code: 'SKILL-SEC',
    number: 'SKILL',
    name: 'Skill Development & Training Section',
    shortName: 'Skill Dev Section',
    type: 'administrative',
    category: 'Administrative',
    department: 'Center for Skill Development & Employability',
    capacity: 30,
    status: 'Operational',
    wing: 'South Core',
    description: 'Institutional skill development, industry certifications, and technical workshops coordination center.',
    rect: { x: 655, y: 410, w: 135, h: 100 },
  },
  {
    id: 'mb-1-stairs-n',
    floor: '1',
    code: 'ST-N',
    number: 'ST',
    name: 'Staircase',
    shortName: 'Staircase',
    type: 'transit',
    category: 'Vertical Transit',
    department: 'Building Transit',
    capacity: null,
    status: 'Operational',
    wing: 'Courtyard North Edge',
    description: 'Staircase situated inside the Open Top courtyard connecting Floor 1 to Ground, 2nd, and 3rd floors.',
    rect: { x: 445, y: 155, w: 70, h: 42 },
  },
  {
    id: 'mb-1-stairs-s',
    floor: '1',
    code: 'ST-S',
    number: 'ST',
    name: 'Staircase',
    shortName: 'Staircase',
    type: 'transit',
    category: 'Vertical Transit',
    department: 'Building Transit',
    capacity: null,
    status: 'Operational',
    wing: 'Courtyard South Edge',
    description: 'Staircase situated inside the Open Top courtyard connecting Ground, 1st, 2nd, and 3rd floors.',
    rect: { x: 445, y: 323, w: 70, h: 42 },
  },

  // ==============================================================
  // SECOND FLOOR (2)
  // Requirement: "in that place 2nd floor there is dept"
  // Faculty Workstations is room 215, reducing numbers before it:
  // 210, 211, 212, 213, 214, 215 along top row; 209-203 around corridor
  // ==============================================================
  {
    id: 'mb-2-dept-0',
    floor: '2',
    code: '210',
    number: '210',
    name: 'HOD Office — Computer Science & Engineering',
    shortName: 'HOD Office (CSE)',
    type: 'administrative',
    category: 'Administrative',
    department: 'Head of Department (CSE)',
    capacity: 15,
    status: 'Operational',
    wing: 'North-West Corner',
    description: 'Executive office of the Head of the Computer Science Department.',
    rect: { x: 40, y: 30, w: 140, h: 80 },
  },
  {
    id: 'mb-2-dept-1',
    floor: '2',
    code: '211',
    number: '211',
    name: 'CSE Department Staff & Faculty Suite',
    shortName: 'CSE Staff Suite',
    type: 'administrative',
    category: 'Administrative',
    department: 'Computer Science Faculty',
    capacity: 25,
    status: 'Operational',
    wing: 'North Core',
    description: 'Faculty workstations and mentoring chambers for professors.',
    rect: { x: 185, y: 30, w: 105, h: 80 },
  },
  {
    id: 'mb-2-dept-2',
    floor: '2',
    code: '212',
    number: '212',
    name: 'CSM & AI Department Office',
    shortName: 'CSM Dept Office',
    type: 'administrative',
    category: 'Administrative',
    department: 'Artificial Intelligence Department',
    capacity: 20,
    status: 'Operational',
    wing: 'North Core',
    description: 'Administrative chamber and staff office for Artificial Intelligence department.',
    rect: { x: 295, y: 30, w: 115, h: 80 },
  },
  {
    id: 'mb-2-dept-3',
    floor: '2',
    code: '213',
    number: '213',
    name: 'Department Conference & Academic Senate Room',
    shortName: 'Dept Conference Room',
    type: 'administrative',
    category: 'Administrative',
    department: 'Academic Senate & Faculty',
    capacity: 32,
    status: 'In Session',
    wing: 'North Central (Dept Row)',
    description: 'Conference and syllabus review chamber situated where Boardroom was on Ground Floor.',
    rect: { x: 415, y: 30, w: 180, h: 80 },
  },
  {
    id: 'mb-2-dept-4',
    floor: '2',
    code: '214',
    number: '214',
    name: 'Faculty Research & Mentorship Cell',
    shortName: 'Research & Guidance',
    type: 'administrative',
    category: 'Administrative',
    department: 'Research & Development',
    capacity: 18,
    status: 'Available',
    wing: 'North-East Core',
    description: 'Student project guidance and faculty publication support cell.',
    rect: { x: 600, y: 30, w: 140, h: 80 },
  },
  {
    id: 'mb-2-dept-5',
    floor: '2',
    code: '215',
    number: '215',
    name: 'Senior Faculty Workstation Lounge',
    shortName: 'Faculty Workstations',
    type: 'administrative',
    category: 'Administrative',
    department: 'Faculty Development',
    capacity: 22,
    status: 'Available',
    wing: 'North-East Wing',
    description: 'Quiet workstation lounge 215 for senior professors and curriculum designers.',
    rect: { x: 745, y: 30, w: 175, h: 80 },
  },
  {
    id: 'mb-2-class-1',
    floor: '2',
    code: '209',
    number: '209',
    name: 'Classroom 209 (West Wing)',
    shortName: 'Classroom 209',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 65,
    status: 'In Session',
    wing: 'West Wing',
    description: '3rd-year engineering lecture classroom with smart displays.',
    rect: { x: 40, y: 155, w: 200, h: 100 },
  },
  {
    id: 'mb-2-class-2',
    floor: '2',
    code: '208',
    number: '208',
    name: 'Classroom 208 (West Wing)',
    shortName: 'Classroom 208',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 65,
    status: 'Available',
    wing: 'West Wing',
    description: 'Lecture classroom for core engineering branches.',
    rect: { x: 40, y: 265, w: 200, h: 100 },
  },
  {
    id: 'mb-2-class-3',
    floor: '2',
    code: '203',
    number: '203',
    name: 'Classroom 203 (East Wing)',
    shortName: 'Classroom 203',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & CSM',
    capacity: 65,
    status: 'Available',
    wing: 'East Wing',
    description: 'East wing smart classroom for technical branches.',
    rect: { x: 720, y: 155, w: 200, h: 100 },
  },
  {
    id: 'mb-2-class-4',
    floor: '2',
    code: '204',
    number: '204',
    name: 'Classroom 204 (East Wing)',
    shortName: 'Classroom 204',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & CSM',
    capacity: 65,
    status: 'In Session',
    wing: 'East Wing',
    description: 'Interactive lecture hall with digital podium.',
    rect: { x: 720, y: 265, w: 200, h: 100 },
  },
  {
    id: 'mb-2-seminar',
    floor: '2',
    code: '207',
    number: '207',
    name: 'Department Tiered Seminar Hall (207)',
    shortName: 'Tiered Seminar Hall',
    type: 'seminar',
    category: 'Seminar Hall',
    department: 'Computer Science & Engineering',
    capacity: 180,
    status: 'Available',
    wing: 'South-West Core',
    description: 'Tiered seminar hall for technical symposiums, research seminars, and guest presentations.',
    rect: { x: 40, y: 410, w: 395, h: 100 },
  },
  {
    id: 'mb-2-library',
    floor: '2',
    code: '206',
    number: '206',
    name: 'Department Digital Library & Research Center (206)',
    shortName: 'Dept Library',
    type: 'administrative',
    category: 'Administrative',
    department: 'Academic Resources',
    capacity: 35,
    status: 'Operational',
    wing: 'South Core',
    description: 'Reference library holding IEEE journals, ACM publications, and online e-resources.',
    rect: { x: 520, y: 410, w: 200, h: 100 },
  },
  {
    id: 'mb-2-class-5',
    floor: '2',
    code: '205',
    number: '205',
    name: 'Classroom 205 (South-East)',
    shortName: 'Classroom 205',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 65,
    status: 'Available',
    wing: 'South-East Core',
    description: 'Lecture classroom on the South corridor concourse.',
    rect: { x: 730, y: 410, w: 190, h: 100 },
  },
  {
    id: 'mb-2-stairs-n',
    floor: '2',
    code: 'ST-N',
    number: 'ST',
    name: 'Staircase',
    shortName: 'Staircase',
    type: 'transit',
    category: 'Vertical Transit',
    department: 'Building Transit',
    capacity: null,
    status: 'Operational',
    wing: 'Courtyard North Edge',
    description: 'Staircase situated inside the Open Top courtyard connecting Floor 2 to Ground, 1st, and 3rd floors.',
    rect: { x: 445, y: 155, w: 70, h: 42 },
  },
  {
    id: 'mb-2-stairs-s',
    floor: '2',
    code: 'ST-S',
    number: 'ST',
    name: 'Staircase',
    shortName: 'Staircase',
    type: 'transit',
    category: 'Vertical Transit',
    department: 'Building Transit',
    capacity: null,
    status: 'Operational',
    wing: 'Courtyard South Edge',
    description: 'Staircase situated inside the Open Top courtyard connecting Ground, 1st, 2nd, and 3rd floors.',
    rect: { x: 445, y: 323, w: 70, h: 42 },
  },

  // ==============================================================
  // THIRD FLOOR (3)
  // Requirement: "and 3rd floor there is big classes"
  // (3rd floor has High-Capacity Tiered Lecture Halls & Big Classes)
  // ==============================================================
  {
    id: 'mb-3-big-0',
    floor: '3',
    code: '310',
    number: '310',
    name: 'Big Class 310 (Smart Lecture Theatre)',
    shortName: 'Big Class 310',
    type: 'classroom',
    category: 'Classroom',
    department: 'Capstone Engineering Studies',
    capacity: 110,
    status: 'In Session',
    wing: 'North-West Corner',
    description: 'High-capacity tiered lecture theatre with dual 4K laser projectors.',
    rect: { x: 40, y: 30, w: 140, h: 80 },
  },
  {
    id: 'mb-3-big-1',
    floor: '3',
    code: '311',
    number: '311',
    name: 'Big Class 311 (Tiered Lecture Hall)',
    shortName: 'Big Class 311',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 110,
    status: 'Available',
    wing: 'North Core',
    description: 'Large lecture auditorium for combined engineering sections.',
    rect: { x: 185, y: 30, w: 105, h: 80 },
  },
  {
    id: 'mb-3-big-2',
    floor: '3',
    code: '312',
    number: '312',
    name: 'Big Class 312 (Tiered Lecture Hall)',
    shortName: 'Big Class 312',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & CSM',
    capacity: 110,
    status: 'In Session',
    wing: 'North Core',
    description: 'High-capacity interactive lecture hall with surround audio system.',
    rect: { x: 295, y: 30, w: 115, h: 80 },
  },
  {
    id: 'mb-3-big-3',
    floor: '3',
    code: '313',
    number: '313',
    name: 'Central Large Lecture Auditorium (Big Class 313)',
    shortName: 'Big Class 313',
    type: 'classroom',
    category: 'Classroom',
    department: 'Institutional Academic Council',
    capacity: 140,
    status: 'Available',
    wing: 'North Central',
    description: 'Central large lecture auditorium spanning the former Boardroom coordinates on Level 3.',
    rect: { x: 415, y: 30, w: 180, h: 80 },
  },
  {
    id: 'mb-3-big-4',
    floor: '3',
    code: '314',
    number: '314',
    name: 'Big Class 314 (Tiered Lecture Hall)',
    shortName: 'Big Class 314',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 110,
    status: 'Available',
    wing: 'North-East Core',
    description: 'Tiered amphitheatre-style engineering lecture classroom.',
    rect: { x: 600, y: 30, w: 140, h: 80 },
  },
  {
    id: 'mb-3-big-5',
    floor: '3',
    code: '315',
    number: '315',
    name: 'Capstone Presentation Arena (Big Class 315)',
    shortName: 'Big Class 315',
    type: 'classroom',
    category: 'Classroom',
    department: 'Capstone Project Evaluation',
    capacity: 120,
    status: 'Operational',
    wing: 'North-East Wing',
    description: 'Tiered presentation arena for major final-year project exhibitions.',
    rect: { x: 745, y: 30, w: 175, h: 80 },
  },
  {
    id: 'mb-3-class-1',
    floor: '3',
    code: '309',
    number: '309',
    name: 'Classroom 309 (West Wing)',
    shortName: 'Classroom 309',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 70,
    status: 'In Session',
    wing: 'West Wing',
    description: 'Senior engineering classroom with modern digital whiteboard.',
    rect: { x: 40, y: 155, w: 200, h: 100 },
  },
  {
    id: 'mb-3-class-2',
    floor: '3',
    code: '308',
    number: '308',
    name: 'Classroom 308 (West Wing)',
    shortName: 'Classroom 308',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 70,
    status: 'Available',
    wing: 'West Wing',
    description: 'Senior lecture classroom for specialized technical electives.',
    rect: { x: 40, y: 265, w: 200, h: 100 },
  },
  {
    id: 'mb-3-class-3',
    floor: '3',
    code: '303',
    number: '303',
    name: 'Classroom 303 (East Wing)',
    shortName: 'Classroom 303',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & CSM',
    capacity: 70,
    status: 'Available',
    wing: 'East Wing',
    description: 'East wing lecture hall for final-year sections.',
    rect: { x: 720, y: 155, w: 200, h: 100 },
  },
  {
    id: 'mb-3-class-4',
    floor: '3',
    code: '304',
    number: '304',
    name: 'Classroom 304 (East Wing)',
    shortName: 'Classroom 304',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & CSM',
    capacity: 70,
    status: 'In Session',
    wing: 'East Wing',
    description: 'Interactive smart lecture room.',
    rect: { x: 720, y: 265, w: 200, h: 100 },
  },
  {
    id: 'mb-3-auditorium',
    floor: '3',
    code: '307',
    number: '307',
    name: 'Grand Multipurpose Auditorium & Assembly Hall (307)',
    shortName: 'Grand Auditorium',
    type: 'seminar',
    category: 'Seminar Hall',
    department: 'Institutional Conventions',
    capacity: 250,
    status: 'Available',
    wing: 'South-West Core',
    description: 'High-capacity tiered auditorium for international symposiums and guest keynote lectures.',
    rect: { x: 40, y: 410, w: 395, h: 100 },
  },
  {
    id: 'mb-3-innovation',
    floor: '3',
    code: '306',
    number: '306',
    name: 'Robotics, Drone & Autonomous Systems Arena (306)',
    shortName: 'Robotics Arena',
    type: 'laboratory',
    category: 'Laboratory',
    department: 'Innovation & Robotics Cell',
    capacity: 45,
    status: 'Operational',
    wing: 'South Core',
    description: 'Prototyping arena and obstacle course for autonomous robots, drones, and mechatronic systems.',
    rect: { x: 520, y: 410, w: 200, h: 100 },
  },
  {
    id: 'mb-3-class-5',
    floor: '3',
    code: '305',
    number: '305',
    name: 'Classroom 305 (South-East)',
    shortName: 'Classroom 305',
    type: 'classroom',
    category: 'Classroom',
    department: 'Computer Science & Engineering',
    capacity: 70,
    status: 'Available',
    wing: 'South-East Core',
    description: 'Classroom suite along the South concourse.',
    rect: { x: 730, y: 410, w: 190, h: 100 },
  },
  {
    id: 'mb-3-stairs-n',
    floor: '3',
    code: 'ST-N',
    number: 'ST',
    name: 'Staircase',
    shortName: 'Staircase',
    type: 'transit',
    category: 'Vertical Transit',
    department: 'Building Transit',
    capacity: null,
    status: 'Operational',
    wing: 'Courtyard North Edge',
    description: 'Staircase situated inside the Open Top courtyard connecting Floor 3 to Ground, 1st, and 2nd floors.',
    rect: { x: 445, y: 155, w: 70, h: 42 },
  },
  {
    id: 'mb-3-stairs-s',
    floor: '3',
    code: 'ST-S',
    number: 'ST',
    name: 'Staircase',
    shortName: 'Staircase',
    type: 'transit',
    category: 'Vertical Transit',
    department: 'Building Transit',
    capacity: null,
    status: 'Operational',
    wing: 'Courtyard South Edge',
    description: 'Staircase situated inside the Open Top courtyard connecting Ground, 1st, 2nd, and 3rd floors.',
    rect: { x: 445, y: 323, w: 70, h: 42 },
  },
];

export function getRoomsByFloor(floor) {
  return MAIN_BLOCK_ROOMS.filter((r) => r.floor === floor);
}

export function getMainBlockRoomById(id) {
  if (!id) return null;
  return MAIN_BLOCK_ROOMS.find((r) => r.id === id || r.code === id || r.number === id) || null;
}

export function searchMainBlockRooms(query) {
  if (!query || !query.trim()) return MAIN_BLOCK_ROOMS;
  const q = query.trim().toLowerCase();
  return MAIN_BLOCK_ROOMS.filter((r) => {
    const matchName = r.name.toLowerCase().includes(q);
    const matchShort = r.shortName.toLowerCase().includes(q);
    const matchCode = r.code.toLowerCase().includes(q);
    const matchNum = r.number.toLowerCase().includes(q);
    const matchType = r.category.toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
    const matchDept = r.department ? r.department.toLowerCase().includes(q) : false;
    const matchWing = r.wing ? r.wing.toLowerCase().includes(q) : false;

    if (q === 'classroom' || q === 'classes' || q === 'class') return r.type === 'classroom';
    if (q === 'lab' || q === 'labs' || q === 'laboratory') return r.type === 'laboratory';
    if (q === 'seminar' || q === 'seminar hall' || q === 'similar hall') return r.type === 'seminar';
    if (q === 'marquee' || q === 'marquis' || q === 'kiosk' || q === 'display') return r.id && r.id.includes('marquee');
    if (q === 'skill' || q === 'skill dev' || q === 'skill development') return r.name.toLowerCase().includes('skill');
    if (q === 'dept' || q === 'department') return r.department ? r.department.toLowerCase().includes('dept') || r.name.toLowerCase().includes('dept') : false;
    if (q === 'board' || q === 'boardroom' || q === 'board room') return r.name.toLowerCase().includes('board');
    if (q === 'chairman' || q === "chairman's room") return r.name.toLowerCase().includes('chairman');
    if (q === 'lounge') return r.name.toLowerCase().includes('lounge');
    if (q === 'exam' || q === 'exam section') return r.name.toLowerCase().includes('exam');
    if (q === 'action' || q === 'acton') return r.name.toLowerCase().includes('action');
    if (q === 'stairs' || q === 'staircase') return r.type === 'transit';

    return matchName || matchShort || matchCode || matchNum || matchType || matchDept || matchWing;
  });
}

// ── Corridor Routing Points Generator ───────────────────────────
// Calculates precise path coordinates along the user's Green Corridor
// Corridors form a rectangular loop around the central "Open top"
// North corridor: y = 132
// South corridor: y = 387
// West corridor:  x = 265
// East corridor:  x = 695

export function getCorridorDoorPoint(room) {
  if (!room) return { x: 480, y: 500 };
  if (room.id === 'entrance' || room.id === 'main_entrance') {
    return { x: 480, y: 500 };
  }
  const { x, y, w, h } = room.rect || { x: 480, y: 387, w: 50, h: 50 };

  // Top Row rooms (door at bottom edge touching North corridor)
  if (y <= 40) {
    return { x: Math.round(x + w / 2), y: 132 };
  }
  // Bottom Row rooms (door at top edge touching South corridor)
  if (y >= 400) {
    return { x: Math.round(x + w / 2), y: 387 };
  }
  // Left Column rooms (door at right edge touching West corridor)
  if (x <= 50) {
    return { x: 265, y: Math.round(y + h / 2) };
  }
  // Right Column rooms (door at left edge touching East corridor)
  if (x >= 700) {
    return { x: 695, y: Math.round(y + h / 2) };
  }
  // North Staircase
  if (room.id && room.id.includes('stairs-n')) {
    return { x: 480, y: 132 };
  }
  // South Staircase
  if (room.id && (room.id.includes('stairs-s') || room.id.includes('stairs-main'))) {
    return { x: 480, y: 387 };
  }

  return { x: Math.round(x + w / 2), y: Math.round(y + h / 2) };
}

/**
 * Calculates continuous corridor polyline coordinates along the Green Corridor loop.
 */
export function getCorridorRoutePoints(fromRoom, toRoom) {
  const p1 = getCorridorDoorPoint(fromRoom);
  const p2 = getCorridorDoorPoint(toRoom);

  const points = [p1];

  // If start is Main Entrance, walk up to South Corridor junction
  if (fromRoom.id === 'entrance' || fromRoom.id === 'main_entrance') {
    points.push({ x: 480, y: 387 });
  }

  // Corridors: North (y = 132), South (y = 387), West (x = 265), East (x = 695)

  // Calculate corridor waypoint routing around Open top
  const currentY = points[points.length - 1].y;
  const currentX = points[points.length - 1].x;

  if (Math.abs(currentY - p2.y) > 20) {
    // Needs vertical navigation
    if (p2.x >= 500) {
      // Route via East Corridor
      if (currentY !== 387 && currentY !== 132) {
        points.push({ x: currentX, y: p2.y < 260 ? 132 : 387 });
      }
      points.push({ x: 695, y: points[points.length - 1].y });
      points.push({ x: 695, y: p2.y });
    } else {
      // Route via West Corridor
      if (currentY !== 387 && currentY !== 132) {
        points.push({ x: currentX, y: p2.y < 260 ? 132 : 387 });
      }
      points.push({ x: 265, y: points[points.length - 1].y });
      points.push({ x: 265, y: p2.y });
    }
  }

  // Final alignment to destination door
  if (points[points.length - 1].x !== p2.x || points[points.length - 1].y !== p2.y) {
    points.push({ x: p2.x, y: points[points.length - 1].y });
    points.push(p2);
  }

  return points;
}

// ── Internal Directions Generator ───────────────────────────────
export function getInternalDirections(fromId, toId) {
  if (!fromId || !toId) return null;

  let fromRoom = null;
  if (fromId === 'entrance' || fromId === 'main_entrance') {
    fromRoom = {
      id: 'entrance',
      floor: 'G',
      name: 'Main Block Entrance (Ground Floor)',
      shortName: 'Ground Entrance',
      wing: 'South Concourse',
      category: 'Entrance',
      rect: { x: 450, y: 470, w: 60, h: 50 },
    };
  } else {
    fromRoom = getMainBlockRoomById(fromId);
  }

  const toRoom = getMainBlockRoomById(toId);
  if (!fromRoom || !toRoom) return null;

  const sameFloor = fromRoom.floor === toRoom.floor;
  const isNorth = toRoom.rect ? toRoom.rect.y < 270 : false;
  const stairName = 'Staircase';
  const stairId = isNorth ? `mb-${fromRoom.floor}-stairs-n` : `mb-${fromRoom.floor}-stairs-s`;
  const stairRoom = getMainBlockRoomById(stairId) || {
    id: stairId,
    floor: fromRoom.floor,
    name: stairName,
    rect: { x: 445, y: isNorth ? 155 : 323, w: 70, h: 42 },
  };

  const fromFloorLabel = fromRoom.floor === 'G' ? 'Ground Floor' : `Floor ${fromRoom.floor}`;
  const toFloorLabel = toRoom.floor === 'G' ? 'Ground Floor' : `Floor ${toRoom.floor}`;

  // Calculate corridor polyline points
  const pathPoints = sameFloor
    ? getCorridorRoutePoints(fromRoom, toRoom)
    : getCorridorRoutePoints(fromRoom, stairRoom);

  const steps = [];

  if (sameFloor) {
    steps.push({
      stepNumber: 1,
      type: 'start',
      state: 'start',
      label: 'START',
      title: fromRoom.name,
      desc: `Depart from ${fromRoom.shortName} on ${fromFloorLabel}.`,
      floor: fromRoom.floor,
    });
    steps.push({
      stepNumber: 2,
      type: 'move',
      state: 'neutral',
      label: 'CORRIDOR WALKWAY',
      title: `Follow the Green Corridor toward ${toRoom.shortName}`,
      desc: `Walk along the Green Corridor walkway looping around the Open Top Courtyard to ${toRoom.number || toRoom.shortName}.`,
      floor: fromRoom.floor,
    });
    steps.push({
      stepNumber: 3,
      type: 'arrive',
      state: 'arrive',
      label: 'ARRIVE',
      title: toRoom.name,
      desc: `Destination reached at door ${toRoom.number || toRoom.shortName} on ${fromFloorLabel}.`,
      floor: toRoom.floor,
    });

    return {
      sameRoom: fromRoom.id === toRoom.id,
      sameFloor: true,
      fromRoom,
      toRoom,
      stepCount: 3,
      floorSummary: `Same Level · ${fromFloorLabel}`,
      overviewPath: [fromFloorLabel, 'Green Corridor', toRoom.shortName || toRoom.name],
      steps,
      pathPoints,
    };
  } else {
    steps.push({
      stepNumber: 1,
      type: 'start',
      state: 'start',
      label: 'START',
      title: fromRoom.name,
      desc: `Depart on ${fromFloorLabel}.`,
      floor: fromRoom.floor,
    });
    steps.push({
      stepNumber: 2,
      type: 'move',
      state: 'neutral',
      label: 'CORRIDOR WALKWAY',
      title: `Walk along Green Corridor to ${stairName}`,
      desc: `Follow the Green Corridor around the Open Top Courtyard to reach ${stairName}.`,
      floor: fromRoom.floor,
    });
    steps.push({
      stepNumber: 3,
      type: 'floor-change',
      state: 'transition',
      label: 'CHANGE FLOOR',
      title: `Take ${stairName} to ${toFloorLabel}`,
      desc: `Ascend via ${stairName} from ${fromFloorLabel} to ${toFloorLabel}.`,
      floor: toRoom.floor,
      fromFloor: fromRoom.floor,
      toFloor: toRoom.floor,
      stairName,
    });
    steps.push({
      stepNumber: 4,
      type: 'continue',
      state: 'neutral',
      label: 'CONTINUE',
      title: `Follow Green Corridor on ${toFloorLabel}`,
      desc: `Exit stairwell and proceed along the Green Corridor on ${toFloorLabel} to ${toRoom.number || toRoom.shortName}.`,
      floor: toRoom.floor,
    });
    steps.push({
      stepNumber: 5,
      type: 'arrive',
      state: 'arrive',
      label: 'ARRIVE',
      title: toRoom.name,
      desc: `Arrive at ${toRoom.name} on ${toFloorLabel}.`,
      floor: toRoom.floor,
    });

    return {
      sameRoom: false,
      sameFloor: false,
      fromRoom,
      toRoom,
      stepCount: 5,
      floorSummary: `${fromFloorLabel} → ${toFloorLabel}`,
      transitStair: stairName,
      overviewPath: [fromFloorLabel, stairName, toFloorLabel, toRoom.shortName || toRoom.number],
      steps,
      pathPoints,
    };
  }
}

export const CATEGORY_LABELS = {
  all: 'All Spaces',
  classroom: 'Classrooms',
  laboratory: 'Labs',
  administrative: 'Admin',
  seminar: 'Seminar Halls',
  facility: 'Facilities',
};

export function matchesCategory(room, category) {
  if (!category || category === 'all') return true;
  if (!room) return false;
  const t = room.type;
  if (category === 'classroom') return t === 'classroom';
  if (category === 'laboratory') return t === 'laboratory';
  if (category === 'administrative') return t === 'administrative';
  if (category === 'seminar') return t === 'seminar';
  if (category === 'facility') {
    return t === 'facility' || t === 'transit' || (room.id && room.id.includes('stairs'));
  }
  return t === category;
}
