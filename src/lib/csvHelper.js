// ================================================================
// NaviGO — CSV Timetable, Events & Notices Parser & Exporter
// Allows non-technical staff & students to update data via Excel / CSV.
// ================================================================

const DAY_MAP = {
  monday: 'MON',
  tuesday: 'TUE',
  wednesday: 'WED',
  thursday: 'THU',
  friday: 'FRI',
  saturday: 'SAT',
  mon: 'MON',
  tue: 'TUE',
  wed: 'WED',
  thu: 'THU',
  fri: 'FRI',
  sat: 'SAT'
};

/**
 * Robust CSV line splitter that respects quoted values containing commas.
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(s => s.replace(/^"|"$/g, '').trim());
}

/**
 * Parses CSV text into NaviGO timetable slot objects.
 * Format expected:
 * Class, Day, Slot ID, Start Time, End Time, Subject Code, Subject Name, Room, Faculty Name
 */
export function parseTimetableCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];

  const header = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  
  const classIdx = header.findIndex(h => h.includes('class') || h.includes('sec'));
  const dayIdx = header.findIndex(h => h.includes('day'));
  const slotIdx = header.findIndex(h => h.includes('slot') || h.includes('period'));
  const startIdx = header.findIndex(h => h.includes('start'));
  const endIdx = header.findIndex(h => h.includes('end'));
  const subCodeIdx = header.findIndex(h => h.includes('code') || h.includes('short'));
  const subNameIdx = header.findIndex(h => h.includes('subject') || h.includes('course') || h.includes('name'));
  const roomIdx = header.findIndex(h => h.includes('room') || h.includes('lab'));
  const facultyIdx = header.findIndex(h => h.includes('faculty') || h.includes('teacher'));

  const slots = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = parseCSVLine(lines[i]);
    if (parts.length < 4) continue;

    const rawClass = (classIdx >= 0 ? parts[classIdx] : parts[0]) || 'CSE A';
    const classId = rawClass.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^class_/, '');
    
    const rawDay = (dayIdx >= 0 ? parts[dayIdx] : parts[1]) || 'Monday';
    const day = DAY_MAP[rawDay.toLowerCase()] || 'MON';

    const slotId = (slotIdx >= 0 ? parts[slotIdx] : parts[2]) || `P${i % 6 + 1}`;
    const startTime = (startIdx >= 0 ? parts[startIdx] : parts[3]) || '09:00';
    const endTime = (endIdx >= 0 ? parts[endIdx] : parts[4]) || '10:10';
    
    const subjectCode = (subCodeIdx >= 0 ? parts[subCodeIdx] : parts[5]) || '';
    const subject = (subNameIdx >= 0 ? parts[subNameIdx] : parts[6]) || subjectCode || 'Class';
    
    const room = (roomIdx >= 0 ? parts[roomIdx] : parts[7]) || '005';
    const roomId = 'room_' + room.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    const facultyName = (facultyIdx >= 0 ? parts[facultyIdx] : parts[8]) || '';

    slots.push({
      id: `tt_csv_${classId}_${day.toLowerCase()}_${slotId.toLowerCase()}_${i}`,
      classId,
      day,
      slotId,
      startTime,
      endTime,
      subject,
      subjectCode,
      room,
      roomId,
      facultyName
    });
  }

  return slots;
}

/**
 * Generates downloadable CSV content from timetable slots.
 */
export function exportTimetableCSV(slots) {
  const header = 'Class,Day,Slot ID,Start Time,End Time,Subject Code,Subject Name,Room,Faculty Name\r\n';
  const dayNames = {
    MON: 'Monday',
    TUE: 'Tuesday',
    WED: 'Wednesday',
    THU: 'Thursday',
    FRI: 'Friday',
    SAT: 'Saturday'
  };

  const rows = (slots || []).map(s => {
    const cls = (s.classId || '').replace(/_/g, ' ').toUpperCase();
    const day = dayNames[s.day] || s.day || 'Monday';
    const subCode = (s.subjectCode || '').replace(/"/g, '""');
    const sub = (s.subject || '').replace(/"/g, '""');
    const room = (s.room || '').replace(/"/g, '""');
    const fac = (s.facultyName || '').replace(/"/g, '""');

    return `"${cls}","${day}","${s.slotId || ''}","${s.startTime || ''}","${s.endTime || ''}","${subCode}","${sub}","${room}","${fac}"`;
  });

  return header + rows.join('\r\n');
}

/**
 * Parses CSV text into event objects.
 * Format expected:
 * Title, Category, Date, Time, Venue, Description, Organizer, Tag
 */
export function parseEventsCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];

  const header = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const titleIdx = header.findIndex(h => h.includes('title') || h.includes('event') || h.includes('name'));
  const catIdx = header.findIndex(h => h.includes('cat') || h.includes('type'));
  const dateIdx = header.findIndex(h => h.includes('date'));
  const timeIdx = header.findIndex(h => h.includes('time'));
  const venueIdx = header.findIndex(h => h.includes('venue') || h.includes('loc') || h.includes('room'));
  const descIdx = header.findIndex(h => h.includes('desc') || h.includes('detail') || h.includes('about'));
  const orgIdx = header.findIndex(h => h.includes('org') || h.includes('club') || h.includes('dept'));
  const tagIdx = header.findIndex(h => h.includes('tag'));

  const events = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCSVLine(lines[i]);
    if (parts.length < 2) continue;

    const title = (titleIdx >= 0 ? parts[titleIdx] : parts[0]) || 'Campus Event';
    if (!title.trim()) continue;

    const category = (catIdx >= 0 ? parts[catIdx] : parts[1]) || 'COMPETITION';
    const date = (dateIdx >= 0 ? parts[dateIdx] : parts[2]) || '2026.10.31';
    const time = (timeIdx >= 0 ? parts[timeIdx] : parts[3]) || '09:30 AM';
    const venueName = (venueIdx >= 0 ? parts[venueIdx] : parts[4]) || 'Auditorium';
    const venue = venueName.toLowerCase().includes('lab') ? 'tech_labs' : 'auditorium';
    const description = (descIdx >= 0 ? parts[descIdx] : parts[5]) || 'Event details and student presentations.';
    const organizer = (orgIdx >= 0 ? parts[orgIdx] : parts[6]) || 'Academic Council';
    const tag = (tagIdx >= 0 ? parts[tagIdx] : parts[7]) || (date === '2026.10.31' ? 'TOMORROW' : '');

    events.push({
      id: `ev_csv_${Date.now()}_${i}`,
      title: title.toUpperCase(),
      category: category.toUpperCase().replace(/\s+/g, '_'),
      date,
      time,
      venue,
      venueName: venueName.toUpperCase(),
      description,
      organizer,
      status: 'UPCOMING',
      tag,
      span: 'medium',
    });
  }
  return events;
}

/**
 * Generates downloadable CSV content from events.
 */
export function exportEventsCSV(events) {
  const header = 'Title,Category,Date,Time,Venue,Description,Organizer,Tag\r\n';
  const rows = (events || []).map(e => {
    const title = (e.title || '').replace(/"/g, '""');
    const cat = (e.category || '').replace(/"/g, '""');
    const date = (e.date || '').replace(/"/g, '""');
    const time = (e.time || '').replace(/"/g, '""');
    const venue = (e.venueName || e.venue || '').replace(/"/g, '""');
    const desc = (e.description || '').replace(/"/g, '""');
    const org = (e.organizer || '').replace(/"/g, '""');
    const tag = (e.tag || '').replace(/"/g, '""');
    return `"${title}","${cat}","${date}","${time}","${venue}","${desc}","${org}","${tag}"`;
  });
  return header + rows.join('\r\n');
}

/**
 * Parses CSV text into notice/announcement objects.
 * Format expected:
 * Notice Text, Severity, Date
 */
export function parseNoticesCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];

  const header = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const textIdx = header.findIndex(h => h.includes('notice') || h.includes('text') || h.includes('message') || h.includes('title'));
  const sevIdx = header.findIndex(h => h.includes('sev') || h.includes('type') || h.includes('priority'));
  const dateIdx = header.findIndex(h => h.includes('date'));

  const notices = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCSVLine(lines[i]);
    if (parts.length < 1) continue;

    const text = (textIdx >= 0 ? parts[textIdx] : parts[0]) || '';
    if (!text.trim()) continue;

    const rawSev = (sevIdx >= 0 ? parts[sevIdx] : parts[1]) || 'NOTICE';
    const severity = ['ALERT', 'NOTICE', 'DEADLINE', 'UPDATE', 'EMERGENCY'].includes(rawSev.toUpperCase().trim())
      ? rawSev.toUpperCase().trim()
      : 'NOTICE';
    const date = (dateIdx >= 0 ? parts[dateIdx] : '') || new Date().toISOString();

    notices.push({
      id: `ann_csv_${Date.now()}_${i}`,
      text: text.trim(),
      severity,
      timestamp: date.includes('T') ? date : new Date(date).toISOString(),
    });
  }
  return notices;
}

/**
 * Generates downloadable CSV content from notices.
 */
export function exportNoticesCSV(notices) {
  const header = 'Notice Text,Severity,Date\r\n';
  const rows = (notices || []).map(n => {
    const text = (n.text || '').replace(/"/g, '""');
    const sev = (n.severity || 'NOTICE').replace(/"/g, '""');
    const date = (n.timestamp || new Date().toISOString()).replace(/"/g, '""');
    return `"${text}","${sev}","${date}"`;
  });
  return header + rows.join('\r\n');
}

/**
 * Triggers instant browser download of a CSV file.
 */
export function downloadCSV(filename, csvText) {
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
