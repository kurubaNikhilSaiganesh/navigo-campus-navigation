import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { getClassById } from '../data';
import {
  Mail, Phone, MapPin, BookOpen, Edit3, Check, X,
  LogOut, Shield, Award, AlertCircle, Building2
} from 'lucide-react';

const DESIGNATION_OPTIONS = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Professor & Head',
  'Professor & Dean',
  'Senior Lecturer',
];

const DEPARTMENT_OPTIONS = [
  'Computer Science',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'MBA',
];

export default function ProfileView() {
  const {
    userRole,
    authUser,
    facultyList = [],
    updateFacultyProfile,
    logoutDemo,
    locateOnMap,
    navigateTo,
    theme,
  } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [validationError, setValidationError] = useState('');

  // Find the faculty record associated with the authenticated faculty account
  const facultyRecord = facultyList.find((f) => f.id === authUser?.facultyId || f.email === authUser?.email) ||
    facultyList.find((f) => f.id === 'fac_004') || {
      id: 'fac_004',
      name: 'Dr. Priya Sharma',
      designation: 'Professor',
      department: 'Computer Science',
      subjects: ['Artificial Intelligence', 'Machine Learning', 'Neural Networks'],
      classIds: ['cs_4a'],
      office: 'A-203, Academic Block A',
      email: 'faculty@meridian.demo',
      phone: '+91 98765 43210 (Ext. 2203)',
      buildingId: 'academic_a',
      bio: 'Senior Professor of Computer Science specializing in Artificial Intelligence, Machine Learning, and Neural Networks with 14+ years of academic research and teaching experience.',
    };

  // Form edit state initialized from current facultyRecord
  const [formData, setFormData] = useState({
    name: facultyRecord.name || '',
    designation: facultyRecord.designation || 'Professor',
    department: facultyRecord.department || 'Computer Science',
    email: facultyRecord.email || '',
    phone: facultyRecord.phone || '',
    office: facultyRecord.office || '',
    subjectsText: (facultyRecord.subjects || []).join(', '),
    bio: facultyRecord.bio || '',
  });

  const handleOpenEdit = () => {
    setFormData({
      name: facultyRecord.name || '',
      designation: facultyRecord.designation || 'Professor',
      department: facultyRecord.department || 'Computer Science',
      email: facultyRecord.email || '',
      phone: facultyRecord.phone || '',
      office: facultyRecord.office || '',
      subjectsText: (facultyRecord.subjects || []).join(', '),
      bio: facultyRecord.bio || '',
    });
    setValidationError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setValidationError('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setValidationError('');

    // Validation
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      setValidationError('Full Name is required.');
      return;
    }
    if (trimmedName.length > 60) {
      setValidationError('Full Name cannot exceed 60 characters.');
      return;
    }
    if (!trimmedEmail) {
      setValidationError('Email address is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (formData.phone && formData.phone.length > 30) {
      setValidationError('Phone number cannot exceed 30 characters.');
      return;
    }
    if (formData.office && formData.office.length > 50) {
      setValidationError('Office location cannot exceed 50 characters.');
      return;
    }
    if (formData.bio && formData.bio.length > 500) {
      setValidationError('Biography cannot exceed 500 characters.');
      return;
    }

    const subjectsArray = formData.subjectsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedData = {
      name: trimmedName,
      designation: formData.designation,
      department: formData.department,
      email: trimmedEmail,
      phone: formData.phone.trim(),
      office: formData.office.trim(),
      subjects: subjectsArray.length > 0 ? subjectsArray : facultyRecord.subjects,
      bio: formData.bio.trim(),
    };

    updateFacultyProfile(facultyRecord.id, updatedData);
    setIsEditing(false);
    setSuccessToast('Profile updated successfully! Changes are live in My Profile and Faculty Directory.');
    setTimeout(() => setSuccessToast(''), 4500);
  };

  const initials = facultyRecord.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const assignedClasses = (facultyRecord.classIds || [])
    .map((cid) => getClassById(cid))
    .filter(Boolean);

  const isDark = theme === 'dark';

  // ──────────────────────────────────────────────────────────
  // RENDER: ADMIN VIEW
  // ──────────────────────────────────────────────────────────
  if (userRole === 'admin' || authUser?.role === 'admin') {
    return (
      <div className="px-4 md:px-8 pt-4 pb-8 max-w-4xl mx-auto page-enter space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-1 border border-[var(--glass-border)] mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-mono text-[10px] text-amber-500 uppercase tracking-widest font-bold">
              System Administration · Demo
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">
            Admin Profile.
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Authenticated administrator session for Meridian Campus Operations.
          </p>
        </div>

        <div className="glass-card rounded-xl p-6 sm:p-8 border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl font-black text-white shrink-0 shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--gold) 0%, #D97706 100%)' }}
            >
              AD
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  System Administrator
                </h2>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-500 font-bold">
                  MASTER PERMISSIONS
                </span>
              </div>
              <p className="font-mono text-xs text-[var(--gold)] font-semibold">
                Meridian IT Operations &amp; Campus Registry Management
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-2 max-w-lg">
                Superuser access: Manage events, broadcast campus marquee announcements, update classroom assignments, manage exam seating, and toggle facility operational statuses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg glass-1 border border-[var(--glass-border)] mb-6 text-xs font-mono">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Admin Email</p>
              <p className="text-[var(--text-primary)] font-semibold mt-0.5">admin@meridian.demo</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Assigned Department</p>
              <p className="text-[var(--text-primary)] font-semibold mt-0.5">Central IT Services</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Session Status</p>
              <p className="text-emerald-400 font-bold mt-0.5">Active Demo Session</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--glass-border)]">
            <button
              onClick={() => navigateTo('admin')}
              className="glass-btn glass-btn-primary rounded-lg px-6 py-2.5 text-xs font-bold shadow-md flex items-center gap-2"
            >
              <Shield size={14} />
              <span>Go to Admin Settings Panel</span>
            </button>
            <button
              onClick={logoutDemo}
              className="glass-btn glass-btn-ghost rounded-lg px-5 py-2.5 text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────
  // RENDER: FACULTY / STAFF VIEW (Displays ONLY logged-in faculty record)
  // ──────────────────────────────────────────────────────────
  return (
    <div className="px-4 md:px-8 pt-4 pb-8 max-w-4xl mx-auto page-enter space-y-6">
      {/* Toast Feedback */}
      {successToast && (
        <div className="p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold bg-emerald-500/10 border-emerald-500/30 text-emerald-400 animate-slide-up shadow-lg">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-400 hover:opacity-80">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-1 border border-[var(--glass-border)] mb-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="font-mono text-[10px] text-violet-400 uppercase tracking-widest font-bold">
              Authenticated Faculty Account
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">
            My Profile.
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Personal faculty credentials, office contact details, and teaching assignments.
          </p>
        </div>

        {!isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenEdit}
              className="glass-btn glass-btn-primary rounded-lg px-5 py-2.5 text-xs font-bold shadow-md flex items-center gap-2 hover:scale-105 transition-all"
              id="edit-profile-btn"
            >
              <Edit3 size={14} />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={logoutDemo}
              className="glass-btn glass-btn-ghost rounded-lg px-4 py-2.5 text-xs font-semibold text-[var(--text-muted)] hover:text-red-400 flex items-center gap-1.5 transition-colors"
              title="Log out of Faculty Demo"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Faculty Profile Display Card */}
      {!isEditing ? (
        <div className="glass-card rounded-xl border border-[var(--glass-border)] shadow-xl overflow-hidden">
          {/* Top Banner & Identity */}
          <div className="p-6 sm:p-8 border-b border-[var(--glass-border)] bg-[var(--glass-2)] relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar Initials with Gradient */}
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl font-black text-white shrink-0 shadow-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700"
              >
                {initials}
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
                    {facultyRecord.name}
                  </h2>
                  <span className="font-mono text-[9px] px-2.5 py-0.5 rounded-md bg-violet-500/20 text-violet-400 border border-violet-500/30 font-bold uppercase tracking-wider">
                    {facultyRecord.department}
                  </span>
                </div>

                <p className="font-mono text-xs text-[var(--gold)] font-bold tracking-wide">
                  {facultyRecord.designation} · Department of {facultyRecord.department}
                </p>

                {/* Biography */}
                <div className="mt-4 p-4 rounded-lg glass-1 border border-[var(--glass-border)] text-xs text-[var(--text-secondary)] leading-relaxed">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold mb-1">
                    Biography &amp; Research Focus
                  </p>
                  <p>{facultyRecord.bio || 'No biography added yet.'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact and Office Details Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Email */}
              <div className="p-4 rounded-lg glass-1 border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
                  <Mail size={13} className="text-violet-400" />
                  <p className="font-mono text-[9px] uppercase tracking-wider font-bold">Email Address</p>
                </div>
                <a
                  href={`mailto:${facultyRecord.email}`}
                  className="font-mono text-xs font-semibold text-[var(--text-primary)] hover:text-violet-400 hover:underline break-all"
                >
                  {facultyRecord.email}
                </a>
              </div>

              {/* Phone */}
              <div className="p-4 rounded-lg glass-1 border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
                  <Phone size={13} className="text-emerald-400" />
                  <p className="font-mono text-[9px] uppercase tracking-wider font-bold">Phone / Extension</p>
                </div>
                <p className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                  {facultyRecord.phone || '—'}
                </p>
              </div>

              {/* Office Room */}
              <div className="p-4 rounded-lg glass-1 border border-[var(--glass-border)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
                    <MapPin size={13} className="text-[var(--gold)]" />
                    <p className="font-mono text-[9px] uppercase tracking-wider font-bold">Office &amp; Room</p>
                  </div>
                  <p className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                    {facultyRecord.office || '—'}
                  </p>
                </div>
                <button
                  onClick={() => locateOnMap(facultyRecord.buildingId || 'academic_a')}
                  className="mt-2 text-[10px] font-mono text-[var(--gold)] hover:underline flex items-center gap-1 font-bold"
                >
                  <Building2 size={11} />
                  <span>Locate Building</span>
                </button>
              </div>
            </div>

            {/* Areas of Expertise / Subjects */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={14} className="text-amber-400" />
                <h3 className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                  Subjects &amp; Areas of Expertise
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(facultyRecord.subjects || []).map((subject) => (
                  <span
                    key={subject}
                    className="font-mono text-xs px-3.5 py-1.5 rounded-md glass-1 border border-[var(--glass-border)] text-[var(--text-primary)] font-medium shadow-xs"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Teaching Assignments */}
            {assignedClasses.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award size={14} className="text-emerald-400" />
                  <h3 className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                    Active Teaching Assignments
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assignedClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="p-3.5 rounded-lg glass-1 border border-[var(--glass-border)] flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm text-[var(--text-primary)]">{cls.name}</p>
                        <p className="font-mono text-[10px] text-[var(--text-muted)]">
                          {cls.department} · {cls.strength} Students
                        </p>
                      </div>
                      <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-500 font-bold">
                        {cls.shortName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Edit Profile Form Mode */
        <div className="glass-card rounded-xl border border-[var(--glass-border-strong)] p-6 sm:p-8 shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--glass-border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--gold)]/20 text-[var(--gold)] flex items-center justify-center font-bold">
                <Edit3 size={15} />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                  Edit Faculty Profile
                </h3>
                <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider">
                  Update your personal record for My Profile &amp; Directory
                </p>
              </div>
            </div>
            <button
              onClick={handleCancelEdit}
              className="glass-btn glass-btn-ghost rounded-lg w-8 h-8 flex items-center justify-center text-[var(--text-muted)]"
            >
              <X size={15} />
            </button>
          </div>

          {validationError && (
            <div className="mb-5 p-3 rounded-lg border flex items-center gap-2 text-xs font-semibold bg-red-500/10 border-red-500/30 text-red-400">
              <AlertCircle size={15} className="shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5 font-semibold">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  maxLength={60}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Priya Sharma"
                  className="w-full glass-input px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-xs"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5 font-semibold">
                  Designation *
                </label>
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full glass-select px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium appearance-none cursor-pointer"
                  style={{ background: isDark ? '#181820' : '#f5f5f5' }}
                >
                  {DESIGNATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className={isDark ? 'bg-[#181820] text-white' : 'bg-white text-black'}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5 font-semibold">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full glass-select px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium appearance-none cursor-pointer"
                  style={{ background: isDark ? '#181820' : '#f5f5f5' }}
                >
                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <option key={dept} value={dept} className={isDark ? 'bg-[#181820] text-white' : 'bg-white text-black'}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5 font-semibold">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="faculty@meridian.demo"
                  className="w-full glass-input px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-xs"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5 font-semibold">
                  Phone / Extension
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210 (Ext. 2203)"
                  className="w-full glass-input px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-xs"
                />
              </div>

              {/* Office Room */}
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5 font-semibold">
                  Office / Room Location
                </label>
                <input
                  type="text"
                  maxLength={50}
                  value={formData.office}
                  onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                  placeholder="A-203, Academic Block A"
                  className="w-full glass-input px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-xs"
                />
              </div>
            </div>

            {/* Subjects Text */}
            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5 font-semibold">
                Subjects / Areas of Expertise (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.subjectsText}
                onChange={(e) => setFormData({ ...formData, subjectsText: e.target.value })}
                placeholder="Artificial Intelligence, Machine Learning, Neural Networks"
                className="w-full glass-input px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-xs"
              />
            </div>

            {/* Short Bio */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">
                  Short Biography &amp; Research Summary
                </label>
                <span className="font-mono text-[9px] text-[var(--text-subtle)]">
                  {formData.bio.length}/500 chars
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={500}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Describe your academic focus, research areas, and teaching experience..."
                className="w-full glass-input p-3 rounded-lg text-xs sm:text-sm font-medium shadow-xs leading-relaxed"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[var(--glass-border)]">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="glass-btn glass-btn-ghost rounded-lg px-5 py-2.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glass-btn glass-btn-primary rounded-lg px-6 py-2.5 text-xs font-bold shadow-md flex items-center gap-1.5"
                id="save-profile-btn"
              >
                <Check size={14} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
