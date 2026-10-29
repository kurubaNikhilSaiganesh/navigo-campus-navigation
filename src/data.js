// ============================================================
// CAMPUS_NAV — DATA MODULE
// Buildings, Events, Pathways, Adjacency Graph,
// Classes, Faculty, Rooms, Timetable
// ============================================================

export const BUILDINGS = [
  {
    id: "admin",
    label: "ADMIN BLOCK",
    short: "ADMIN",
    code: "B-01",
    type: "admin",
    x: 120,
    y: 100,
    w: 100,
    h: 70,
    department: "Administration & Registrar",
    description: "Central administrative hub housing the registrar, finance, and principal's office.",
    facilities: ["Registrar Office", "Principal's Office", "Finance Dept", "HR Division"],
    accessible: true,
  },
  {
    id: "academic_a",
    label: "ACADEMIC BLOCK A",
    short: "ACAD-A",
    code: "B-02",
    type: "academic",
    x: 280,
    y: 80,
    w: 110,
    h: 75,
    department: "Engineering & Sciences",
    description: "Houses CS, IT, and Electronics departments with smart classrooms and seminar halls.",
    facilities: ["CS Dept", "IT Dept", "Electronics Dept", "Seminar Hall A"],
    accessible: true,
  },
  {
    id: "academic_b",
    label: "ACADEMIC BLOCK B",
    short: "ACAD-B",
    code: "B-03",
    type: "academic",
    x: 420,
    y: 80,
    w: 110,
    h: 75,
    department: "Mechanical & Civil Engineering",
    description: "Mechanical, Civil, and Chemical engineering departments with workshop facilities.",
    facilities: ["Mechanical Dept", "Civil Dept", "Workshop", "Drawing Hall"],
    accessible: true,
  },
  {
    id: "academic_c",
    label: "ACADEMIC BLOCK C",
    short: "ACAD-C",
    code: "B-04",
    type: "academic",
    x: 560,
    y: 80,
    w: 110,
    h: 75,
    department: "Business & Management",
    description: "MBA and management studies block with conference rooms and group discussion halls.",
    facilities: ["MBA Dept", "Conference Room", "GD Hall", "Faculty Lounge"],
    accessible: true,
  },
  {
    id: "library",
    label: "CENTRAL LIBRARY",
    short: "LIBRARY",
    code: "B-05",
    type: "library",
    x: 110,
    y: 260,
    w: 120,
    h: 80,
    department: "Knowledge Resources",
    description: "Multi-floor central library with 50,000+ volumes, e-resources, and reading halls.",
    facilities: ["Reading Hall", "Digital Library", "Archives", "Print Lab"],
    accessible: true,
  },
  {
    id: "tech_labs",
    label: "TECH LABS",
    short: "TECH-LAB",
    code: "B-06",
    type: "lab",
    x: 280,
    y: 240,
    w: 120,
    h: 80,
    department: "Research & Innovation",
    description: "Advanced research labs including IoT lab, AI lab, and fabrication centers.",
    facilities: ["AI/ML Lab", "IoT Lab", "Fab Lab", "Research Center"],
    accessible: false,
  },
  {
    id: "hostel_boys",
    label: "HOSTEL (NORTH)",
    short: "HOSTEL-N",
    code: "B-07",
    type: "hostel",
    x: 560,
    y: 260,
    w: 110,
    h: 80,
    department: "Student Accommodation",
    description: "North hostel block with 400 rooms, common rooms, and recreation facilities.",
    facilities: ["400 Rooms", "Common Room", "Laundry", "TV Room"],
    accessible: false,
  },
  {
    id: "hostel_girls",
    label: "HOSTEL (SOUTH)",
    short: "HOSTEL-S",
    code: "B-08",
    type: "hostel",
    x: 680,
    y: 260,
    w: 110,
    h: 80,
    department: "Student Accommodation",
    description: "South hostel block with 350 rooms, dedicated wardens, and secure access.",
    facilities: ["350 Rooms", "Warden Office", "Pantry", "Study Room"],
    accessible: true,
  },
  {
    id: "canteen",
    label: "MAIN CANTEEN",
    short: "CANTEEN",
    code: "B-09",
    type: "canteen",
    x: 420,
    y: 400,
    w: 120,
    h: 80,
    department: "Food & Dining",
    description: "Central dining facility serving breakfast, lunch, and dinner for 1000+ students.",
    facilities: ["Main Dining Hall", "Snack Counter", "Juice Bar", "Outdoor Seating"],
    accessible: true,
  },
  {
    id: "auditorium",
    label: "AUDITORIUM",
    short: "AUDT",
    code: "B-10",
    type: "auditorium",
    x: 230,
    y: 410,
    w: 130,
    h: 90,
    department: "Events & Conferences",
    description: "State-of-the-art 1200-seat auditorium with modern AV systems for all major events.",
    facilities: ["1200 Seats", "HD Projection", "Green Room", "Sound Studio"],
    accessible: true,
  },
  {
    id: "sports",
    label: "SPORTS COMPLEX",
    short: "SPORTS",
    code: "B-11",
    type: "sports",
    x: 600,
    y: 420,
    w: 140,
    h: 100,
    department: "Athletics & Recreation",
    description: "Full sports complex with indoor courts, outdoor fields, swimming pool, and gym.",
    facilities: ["Basketball Court", "Swimming Pool", "Gym", "Football Ground"],
    accessible: false,
  },
  {
    id: "gate_01",
    label: "MAIN GATE",
    short: "GATE-01",
    code: "G-01",
    type: "gate",
    x: 60,
    y: 510,
    w: 40,
    h: 40,
    department: "Campus Entry",
    description: "Main entry/exit gate with security post and visitor management.",
    facilities: ["Security Post", "Visitor Log"],
    accessible: true,
  },
  {
    id: "gate_02",
    label: "NORTH GATE",
    short: "GATE-02",
    code: "G-02",
    type: "gate",
    x: 380,
    y: 20,
    w: 40,
    h: 40,
    department: "Campus Entry",
    description: "North entry gate primarily used for academic block access.",
    facilities: ["Security Post"],
    accessible: true,
  },
];

// Pathway adjacency graph (node id → list of connected node ids)
export const GRAPH = {
  admin:        ["academic_a", "library", "gate_01"],
  academic_a:   ["admin", "academic_b", "tech_labs", "gate_02"],
  academic_b:   ["academic_a", "academic_c", "tech_labs", "gate_02"],
  academic_c:   ["academic_b", "hostel_boys"],
  library:      ["admin", "tech_labs", "auditorium"],
  tech_labs:    ["academic_a", "academic_b", "library", "canteen"],
  hostel_boys:  ["academic_c", "hostel_girls", "canteen", "sports"],
  hostel_girls: ["hostel_boys", "sports"],
  canteen:      ["tech_labs", "auditorium", "hostel_boys", "sports"],
  auditorium:   ["library", "canteen", "gate_01"],
  sports:       ["hostel_boys", "hostel_girls", "canteen"],
  gate_01:      ["admin", "auditorium"],
  gate_02:      ["academic_a", "academic_b"],
};

// BFS pathfinding
export function findPath(from, to) {
  if (from === to) return null;
  const queue = [[from]];
  const visited = new Set([from]);
  while (queue.length) {
    const path = queue.shift();
    const node = path[path.length - 1];
    if (node === to) return path;
    for (const neighbor of (GRAPH[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  return null;
}

export function getBuildingById(id) {
  return BUILDINGS.find((b) => b.id === id);
}

export function euclidean(a, b) {
  return Math.sqrt(
    Math.pow((a.x + a.w / 2) - (b.x + b.w / 2), 2) +
    Math.pow((a.y + a.h / 2) - (b.y + b.h / 2), 2)
  );
}

export function calcRouteStats(path) {
  let dist = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const a = getBuildingById(path[i]);
    const b = getBuildingById(path[i + 1]);
    if (a && b) dist += euclidean(a, b);
  }
  const realDist = Math.round(dist * 0.6);
  const walkMin = Math.ceil(realDist / 80);
  const accessible = path.every((id) => {
    const b = getBuildingById(id);
    return b ? b.accessible : true;
  });
  return { distance: realDist, time: walkMin, accessible, isDemonstration: true };
}

// ============================================================
// EVENTS DATA
// ============================================================

export const EVENTS = [
  {
    id: "techfest",
    title: "TECHFEST 2026",
    category: "TECH_FEST",
    date: "2026.10.15",
    time: "09:00 AM",
    venue: "auditorium",
    venueName: "AUDITORIUM",
    description: "Annual inter-college tech festival with competitions, exhibits, and industry talks.",
    organizer: "CS Department",
    status: "UPCOMING",
    span: "large",
  },
  {
    id: "hackathon",
    title: "24H HACKATHON",
    category: "HACKATHON",
    date: "2026.10.18",
    time: "10:00 AM",
    venue: "tech_labs",
    venueName: "TECH LABS",
    description: "Build real-world solutions in 24 hours. Teams of 3–5. Prize pool: ₹50,000.",
    organizer: "Innovation Cell",
    status: "UPCOMING",
    span: "medium",
  },
  {
    id: "guest_lecture",
    title: "GUEST LECTURE: AI & SOCIETY",
    category: "LECTURE",
    date: "2026.09.05",
    time: "11:00 AM",
    venue: "auditorium",
    venueName: "AUDITORIUM",
    description: "Distinguished lecture by Dr. Priya Anand on ethical AI, automation, and the future of work.",
    organizer: "Dean's Office",
    status: "COMPLETED",
    span: "small",
  },
  {
    id: "cultural_fest",
    title: "CULTURALIA 2026",
    category: "CULTURAL_FEST",
    date: "2026.11.20",
    time: "05:00 PM",
    venue: "auditorium",
    venueName: "AUDITORIUM",
    description: "3-day cultural extravaganza with music, dance, drama, and fashion competitions.",
    organizer: "Student Council",
    status: "UPCOMING",
    span: "medium",
  },
  {
    id: "workshop",
    title: "REACT & NEXT.JS WORKSHOP",
    category: "WORKSHOP",
    date: "2026.09.12",
    time: "10:00 AM",
    venue: "tech_labs",
    venueName: "TECH LABS",
    description: "Hands-on workshop on modern full-stack development. Limited seats — 40 participants.",
    organizer: "Web Dev Club",
    status: "UPCOMING",
    span: "small",
  },
  {
    id: "sports_meet",
    title: "INTER-DEPT SPORTS MEET",
    category: "SPORTS",
    date: "2026.10.01",
    time: "08:00 AM",
    venue: "sports",
    venueName: "SPORTS COMPLEX",
    description: "Annual sports day with track events, team sports, and aquatics. All departments compete.",
    organizer: "Sports Committee",
    status: "UPCOMING",
    span: "small",
  },
  {
    id: "robotics",
    title: "ROBOTICS CHALLENGE",
    category: "COMPETITION",
    date: "2026.10.22",
    time: "10:00 AM",
    venue: "tech_labs",
    venueName: "TECH LABS",
    description: "Design, build, and program robots to complete obstacle courses. Open to all years.",
    organizer: "Robotics Club",
    status: "UPCOMING",
    span: "small",
  },
];

export const MARQUEE_ITEMS = [
  "[ALERT] TECHFEST REGISTRATIONS CLOSE 2026.10.10",
  "[NOTICE] LIBRARY EXTENDED HOURS THIS WEEK — OPEN TILL 22:00",
  "[DEADLINE] HACKATHON TEAM SUBMISSIONS DUE FRIDAY",
  "[UPDATE] SPORTS COMPLEX RESURFACING COMPLETE — OPEN MONDAY",
  "[ALERT] SEMESTER EXAMS SCHEDULE PUBLISHED — CHECK PORTAL",
  "[NOTICE] CAMPUS WIFI UPGRADE IN PROGRESS — ACADEMIC BLOCKS",
  "[DEADLINE] CULTURALIA REGISTRATION: 2026.10.30",
  "[UPDATE] NEW E-RESOURCES ADDED TO CENTRAL LIBRARY DATABASE",
];

export const TYPE_ICONS_MAP = {
  admin: "ShieldCheck",
  academic: "BookOpen",
  library: "Library",
  lab: "FlaskConical",
  hostel: "Bed",
  canteen: "Utensils",
  auditorium: "Theater",
  sports: "Dumbbell",
  gate: "Gate",
};

// ============================================================
// FACULTY DATA
// ============================================================

export const FACULTY = [
  {
    id: "fac_001",
    name: "Dr. Rajesh Kumar",
    designation: "Professor & Head",
    department: "Computer Science",
    subjects: ["Data Structures", "Algorithms"],
    classIds: ["cs_3a", "cs_3b"],
    office: "A-201, Academic Block A",
    email: "r.kumar@campus.edu",
    phone: "Ext. 2201",
    buildingId: "academic_a",
    bio: "Head of Computer Science with over 18 years of experience in distributed algorithms, graph theory, and curriculum design.",
  },
  {
    id: "fac_002",
    name: "Dr. Meena Sharma",
    designation: "Associate Professor",
    department: "Computer Science",
    subjects: ["Operating Systems", "Computer Networks"],
    classIds: ["cs_2a"],
    office: "A-202, Academic Block A",
    email: "m.sharma@campus.edu",
    phone: "Ext. 2202",
    buildingId: "academic_a",
    bio: "Focuses on Linux kernel architecture, virtualization systems, and performance tuning for edge computing devices.",
  },
  {
    id: "fac_003",
    name: "Prof. Arjun Nair",
    designation: "Assistant Professor",
    department: "Information Technology",
    subjects: ["Web Technologies", "Database Management"],
    classIds: ["it_2b"],
    office: "A-301, Academic Block A",
    email: "a.nair@campus.edu",
    phone: "Ext. 2301",
    buildingId: "academic_a",
    bio: "Specialist in modern web architecture, distributed transactional databases, and scalable cloud application development.",
  },
  {
    id: "fac_004",
    name: "Dr. Priya Sharma",
    designation: "Professor",
    department: "Computer Science",
    subjects: ["Artificial Intelligence", "Machine Learning", "Neural Networks"],
    classIds: ["cs_4a"],
    office: "A-203, Academic Block A",
    email: "faculty@meridian.demo",
    phone: "+91 98765 43210 (Ext. 2203)",
    buildingId: "academic_a",
    bio: "Senior Professor of Computer Science specializing in Artificial Intelligence, Machine Learning, and Neural Networks with 14+ years of academic research and teaching experience.",
  },
  {
    id: "fac_005",
    name: "Prof. Suresh Verma",
    designation: "Associate Professor",
    department: "Mechanical Engineering",
    subjects: ["Thermodynamics", "Fluid Mechanics"],
    classIds: ["me_2a"],
    office: "B-101, Academic Block B",
    email: "s.verma@campus.edu",
    phone: "Ext. 3101",
    buildingId: "academic_b",
    bio: "Expert in computational fluid dynamics and high-efficiency thermodynamic cycles for sustainable energy systems.",
  },
  {
    id: "fac_006",
    name: "Dr. Anita Reddy",
    designation: "Professor",
    department: "Civil Engineering",
    subjects: ["Structural Analysis", "Construction Management"],
    classIds: ["ce_3a"],
    office: "B-201, Academic Block B",
    email: "a.reddy@campus.edu",
    phone: "Ext. 3201",
    buildingId: "academic_b",
    bio: "Consultant for resilient earthquake-resistant structures and advanced materials testing in civic infrastructure.",
  },
  {
    id: "fac_007",
    name: "Prof. Kiran Patel",
    designation: "Assistant Professor",
    department: "Information Technology",
    subjects: ["Cloud Computing", "Cyber Security"],
    classIds: ["it_3a"],
    office: "A-302, Academic Block A",
    email: "k.patel@campus.edu",
    phone: "Ext. 2302",
    buildingId: "academic_a",
    bio: "Active researcher in cryptographic protocols, zero-trust cloud network topologies, and vulnerability analysis.",
  },
  {
    id: "fac_008",
    name: "Dr. Vijay Menon",
    designation: "Professor & Dean",
    department: "MBA",
    subjects: ["Strategic Management", "Business Analytics"],
    classIds: ["mba_1a"],
    office: "C-101, Academic Block C",
    email: "v.menon@campus.edu",
    phone: "Ext. 4101",
    buildingId: "academic_c",
    bio: "Dean of Management Studies advising corporate boards on quantitative business strategy and executive decision systems.",
  },
];

export const INITIAL_FACULTY = FACULTY;

export function getFacultyById(id, facultyList = FACULTY) {
  const list = Array.isArray(facultyList) && facultyList.length > 0 ? facultyList : FACULTY;
  return list.find((f) => f.id === id) || FACULTY.find((f) => f.id === id);
}

// ============================================================
// ROOMS DATA
// ============================================================

export const ROOMS = [
  { id: "room_a101", number: "A-101", building: "Academic Block A", buildingId: "academic_a", floor: "Ground", type: "Lecture Hall", capacity: 80, assignedClassId: "cs_2a", facilities: ["Projector", "AC", "Whiteboard"] },
  { id: "room_a102", number: "A-102", building: "Academic Block A", buildingId: "academic_a", floor: "Ground", type: "Lecture Hall", capacity: 60, assignedClassId: "it_2b", facilities: ["Projector", "Whiteboard"] },
  { id: "room_a201", number: "A-201", building: "Academic Block A", buildingId: "academic_a", floor: "First", type: "Seminar Hall", capacity: 120, assignedClassId: null, facilities: ["Stage", "Projector", "PA System", "AC"] },
  { id: "room_a301", number: "A-301", building: "Academic Block A", buildingId: "academic_a", floor: "Second", type: "Computer Lab", capacity: 40, assignedClassId: "cs_3a", facilities: ["40 PCs", "LAN", "Projector", "AC"] },
  { id: "room_a302", number: "A-302", building: "Academic Block A", buildingId: "academic_a", floor: "Second", type: "Lecture Hall", capacity: 70, assignedClassId: "cs_3b", facilities: ["Projector", "AC", "Whiteboard"] },
  { id: "room_a401", number: "A-401", building: "Academic Block A", buildingId: "academic_a", floor: "Third", type: "Research Lab", capacity: 20, assignedClassId: "cs_4a", facilities: ["GPU Workstations", "AC", "Server Rack"] },
  { id: "room_b101", number: "B-101", building: "Academic Block B", buildingId: "academic_b", floor: "Ground", type: "Drawing Hall", capacity: 60, assignedClassId: "me_2a", facilities: ["Drawing Boards", "Projector"] },
  { id: "room_b201", number: "B-201", building: "Academic Block B", buildingId: "academic_b", floor: "First", type: "Lecture Hall", capacity: 80, assignedClassId: "ce_3a", facilities: ["Projector", "AC", "Whiteboard"] },
  { id: "room_b_workshop", number: "B-WS1", building: "Academic Block B", buildingId: "academic_b", floor: "Ground", type: "Workshop", capacity: 30, assignedClassId: null, facilities: ["Lathe Machines", "CNC", "Safety Equipment"] },
  { id: "room_c101", number: "C-101", building: "Academic Block C", buildingId: "academic_c", floor: "Ground", type: "Conference Room", capacity: 30, assignedClassId: "mba_1a", facilities: ["Conference Table", "Video Conferencing", "AC"] },
  { id: "room_tl_ai", number: "TL-AI1", building: "Tech Labs", buildingId: "tech_labs", floor: "Ground", type: "AI/ML Lab", capacity: 24, assignedClassId: "it_3a", facilities: ["GPU Clusters", "Jupyter Hub", "AC"] },
  { id: "room_tl_iot", number: "TL-IoT1", building: "Tech Labs", buildingId: "tech_labs", floor: "First", type: "IoT Lab", capacity: 20, assignedClassId: null, facilities: ["Arduino Kits", "Raspberry Pi", "3D Printer"] },
];

export function getRoomById(id) {
  return ROOMS.find((r) => r.id === id);
}

export function getRoomByClassId(classId) {
  return ROOMS.find((r) => r.assignedClassId === classId);
}

// ============================================================
// CLASSES DATA
// ============================================================

export const CLASSES = [
  {
    id: "cs_2a",
    name: "2nd Year CSE — Section A",
    shortName: "CS-2A",
    year: 2,
    department: "Computer Science Engineering",
    section: "A",
    strength: 62,
    facultyIds: ["fac_002"],
    roomId: "room_a101",
    description: "Second year Computer Science Engineering students, Section A. Focus on core CS fundamentals.",
  },
  {
    id: "cs_3a",
    name: "3rd Year CSE — Section A",
    shortName: "CS-3A",
    year: 3,
    department: "Computer Science Engineering",
    section: "A",
    strength: 58,
    facultyIds: ["fac_001", "fac_004"],
    roomId: "room_a301",
    description: "Third year Computer Science Engineering students, Section A. Advanced algorithms and AI specialization.",
  },
  {
    id: "cs_3b",
    name: "3rd Year CSE — Section B",
    shortName: "CS-3B",
    year: 3,
    department: "Computer Science Engineering",
    section: "B",
    strength: 60,
    facultyIds: ["fac_001"],
    roomId: "room_a302",
    description: "Third year Computer Science Engineering students, Section B.",
  },
  {
    id: "cs_4a",
    name: "4th Year CSE — Section A",
    shortName: "CS-4A",
    year: 4,
    department: "Computer Science Engineering",
    section: "A",
    strength: 55,
    facultyIds: ["fac_004"],
    roomId: "room_a401",
    description: "Final year CSE students working on AI/ML specialization and capstone projects.",
  },
  {
    id: "it_2b",
    name: "2nd Year IT — Section B",
    shortName: "IT-2B",
    year: 2,
    department: "Information Technology",
    section: "B",
    strength: 60,
    facultyIds: ["fac_003"],
    roomId: "room_a102",
    description: "Second year IT students, Section B. Focus on web technologies and databases.",
  },
  {
    id: "it_3a",
    name: "3rd Year IT — Section A",
    shortName: "IT-3A",
    year: 3,
    department: "Information Technology",
    section: "A",
    strength: 56,
    facultyIds: ["fac_007"],
    roomId: "room_tl_ai",
    description: "Third year IT students specializing in cloud computing and cybersecurity.",
  },
  {
    id: "me_2a",
    name: "2nd Year MECH — Section A",
    shortName: "ME-2A",
    year: 2,
    department: "Mechanical Engineering",
    section: "A",
    strength: 65,
    facultyIds: ["fac_005"],
    roomId: "room_b101",
    description: "Second year Mechanical Engineering students. Core thermodynamics and fluid mechanics.",
  },
  {
    id: "ce_3a",
    name: "3rd Year CIVIL — Section A",
    shortName: "CE-3A",
    year: 3,
    department: "Civil Engineering",
    section: "A",
    strength: 52,
    facultyIds: ["fac_006"],
    roomId: "room_b201",
    description: "Third year Civil Engineering students focusing on structural analysis.",
  },
  {
    id: "mba_1a",
    name: "1st Year MBA — Section A",
    shortName: "MBA-1A",
    year: 1,
    department: "MBA",
    section: "A",
    strength: 45,
    facultyIds: ["fac_008"],
    roomId: "room_c101",
    description: "First year MBA students. Strategic management and business analytics foundations.",
  },
];

export function getClassById(id) {
  return CLASSES.find((c) => c.id === id);
}

// ============================================================
// TIMETABLE DATA
// Days: MON, TUE, WED, THU, FRI, SAT
// ============================================================

export const TIMETABLE = [
  // CS-2A (Mon-Fri)
  { id: "tt_001", classId: "cs_2a", day: "MON", startTime: "09:00", endTime: "10:00", subject: "Operating Systems", facultyId: "fac_002", roomId: "room_a101" },
  { id: "tt_002", classId: "cs_2a", day: "MON", startTime: "10:00", endTime: "11:00", subject: "Computer Networks", facultyId: "fac_002", roomId: "room_a101" },
  { id: "tt_003", classId: "cs_2a", day: "MON", startTime: "12:00", endTime: "13:00", subject: "DBMS Lab", facultyId: "fac_003", roomId: "room_a301" },
  { id: "tt_004", classId: "cs_2a", day: "TUE", startTime: "09:00", endTime: "10:00", subject: "Data Structures", facultyId: "fac_001", roomId: "room_a101" },
  { id: "tt_005", classId: "cs_2a", day: "TUE", startTime: "11:00", endTime: "12:00", subject: "Discrete Mathematics", facultyId: "fac_002", roomId: "room_a101" },
  { id: "tt_006", classId: "cs_2a", day: "WED", startTime: "09:00", endTime: "10:00", subject: "Operating Systems", facultyId: "fac_002", roomId: "room_a101" },
  { id: "tt_007", classId: "cs_2a", day: "WED", startTime: "14:00", endTime: "16:00", subject: "Networks Lab", facultyId: "fac_002", roomId: "room_tl_iot" },
  { id: "tt_008", classId: "cs_2a", day: "THU", startTime: "09:00", endTime: "10:00", subject: "Computer Networks", facultyId: "fac_002", roomId: "room_a101" },
  { id: "tt_009", classId: "cs_2a", day: "FRI", startTime: "10:00", endTime: "11:00", subject: "Data Structures", facultyId: "fac_001", roomId: "room_a101" },

  // CS-3A
  { id: "tt_010", classId: "cs_3a", day: "MON", startTime: "09:00", endTime: "10:00", subject: "Design & Analysis of Algorithms", facultyId: "fac_001", roomId: "room_a301" },
  { id: "tt_011", classId: "cs_3a", day: "MON", startTime: "11:00", endTime: "12:00", subject: "Artificial Intelligence", facultyId: "fac_004", roomId: "room_a301" },
  { id: "tt_012", classId: "cs_3a", day: "TUE", startTime: "09:00", endTime: "10:00", subject: "Machine Learning", facultyId: "fac_004", roomId: "room_a401" },
  { id: "tt_013", classId: "cs_3a", day: "WED", startTime: "10:00", endTime: "11:00", subject: "Design & Analysis of Algorithms", facultyId: "fac_001", roomId: "room_a301" },
  { id: "tt_014", classId: "cs_3a", day: "THU", startTime: "14:00", endTime: "16:00", subject: "AI Lab", facultyId: "fac_004", roomId: "room_tl_ai" },
  { id: "tt_015", classId: "cs_3a", day: "FRI", startTime: "09:00", endTime: "10:00", subject: "Artificial Intelligence", facultyId: "fac_004", roomId: "room_a301" },

  // IT-3A
  { id: "tt_016", classId: "it_3a", day: "MON", startTime: "10:00", endTime: "11:00", subject: "Cloud Computing", facultyId: "fac_007", roomId: "room_tl_ai" },
  { id: "tt_017", classId: "it_3a", day: "TUE", startTime: "14:00", endTime: "16:00", subject: "Cloud Lab", facultyId: "fac_007", roomId: "room_tl_ai" },
  { id: "tt_018", classId: "it_3a", day: "WED", startTime: "09:00", endTime: "10:00", subject: "Cyber Security", facultyId: "fac_007", roomId: "room_tl_ai" },
  { id: "tt_019", classId: "it_3a", day: "FRI", startTime: "10:00", endTime: "11:00", subject: "Cloud Computing", facultyId: "fac_007", roomId: "room_tl_ai" },

  // MBA-1A
  { id: "tt_020", classId: "mba_1a", day: "MON", startTime: "09:00", endTime: "10:30", subject: "Strategic Management", facultyId: "fac_008", roomId: "room_c101" },
  { id: "tt_021", classId: "mba_1a", day: "WED", startTime: "09:00", endTime: "10:30", subject: "Business Analytics", facultyId: "fac_008", roomId: "room_c101" },
  { id: "tt_022", classId: "mba_1a", day: "FRI", startTime: "14:00", endTime: "15:30", subject: "Strategic Management", facultyId: "fac_008", roomId: "room_c101" },
];

export function getTimetableByClass(classId) {
  return TIMETABLE.filter((t) => t.classId === classId);
}

export function getTimetableForDay(classId, day) {
  return TIMETABLE.filter((t) => t.classId === classId && t.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Get current day label
export function getCurrentDay() {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[new Date().getDay()];
}

// ── Export Main Block spatial & floor plan data ──
export * from './data/mainBlockData.js';

