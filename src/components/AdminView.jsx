import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { BUILDINGS, FACULTY, ROOMS, CLASSES, TIMETABLE, getRoomById, getClassById } from '../data';
import { Pencil, X, AlertTriangle } from 'lucide-react';
import { GlassTabs } from './ui/GlassTabs';

const CATEGORIES = ['WORKSHOP', 'LECTURE', 'TECH_FEST', 'HACKATHON', 'CULTURAL_FEST', 'SPORTS', 'COMPETITION'];
const SEVERITIES = ['ALERT', 'NOTICE', 'DEADLINE', 'UPDATE', 'EMERGENCY'];

export default function AdminView() {
  const {
    events, setEvents,
    announcements, addAnnouncement, removeAnnouncement,
    roomOverrides, applyRoomOverride,
    timetableOverrides, applyTimetableOverride,
    locationStatus = {}, toggleLocationStatus,
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('events');
  const [successMsg, setSuccessMsg] = useState('');

  // Event form state
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', category: 'WORKSHOP', date: '', time: '', venue: 'auditorium', description: '',
  });

  // Room change state
  const [roomChangeClass, setRoomChangeClass] = useState('');
  const [roomChangeNewRoom, setRoomChangeNewRoom] = useState('');
  const [roomChangeConfirm, setRoomChangeConfirm] = useState(false);

  // Timetable reschedule state
  const [ttSlotId, setTtSlotId] = useState('');
  const [ttNewStart, setTtNewStart] = useState('');
  const [ttNewEnd, setTtNewEnd] = useState('');
  const [ttNewRoom, setTtNewRoom] = useState('');
  const [ttConfirm, setTtConfirm] = useState(false);

  // Announcement state
  const [annText, setAnnText] = useState('');
  const [annSeverity, setAnnSeverity] = useState('ALERT');

  // Location management & deactivation warning state
  const [deactivationWarning, setDeactivationWarning] = useState(null);

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // --- Location Management ---
  const handleToggleLocation = (building) => {
    const isCurrentlyClosed = locationStatus[building.id] === 'closed';
    if (isCurrentlyClosed) {
      toggleLocationStatus(building.id);
      flash(`${building.label} reactivated — status updated to Operational.`);
      return;
    }

    const referenced = events.filter((e) => e.venue === building.id);
    if (referenced.length > 0) {
      setDeactivationWarning({ building, referencedEvents: referenced });
    } else {
      toggleLocationStatus(building.id);
      flash(`${building.label} marked as Closed — public directory updated.`);
    }
  };

  const confirmDeactivation = () => {
    if (!deactivationWarning) return;
    const { building, referencedEvents } = deactivationWarning;
    toggleLocationStatus(building.id);
    flash(`${building.label} deactivated. ${referencedEvents.length} active event(s) flagged as Closed Venue.`);
    setDeactivationWarning(null);
  };

  const cancelDeactivation = () => {
    setDeactivationWarning(null);
  };

  // --- Events ---
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;
    const event = {
      ...newEvent,
      id: `custom_${Date.now()}`,
      venueName: BUILDINGS.find((b) => b.id === newEvent.venue)?.label || newEvent.venue,
      organizer: 'Admin',
      status: 'UPCOMING',
      span: 'small',
    };
    setEvents([...events, event]);
    setNewEvent({ title: '', category: 'WORKSHOP', date: '', time: '', venue: 'auditorium', description: '' });
    setShowAddEvent(false);
    flash('Event added — visible on Events page.');
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
    flash('Event removed from Events page.');
  };

  // --- Room change ---
  const handleRoomChange = () => {
    if (!roomChangeClass || !roomChangeNewRoom) return;
    applyRoomOverride(roomChangeClass, roomChangeNewRoom);
    const cls = getClassById(roomChangeClass);
    const room = getRoomById(roomChangeNewRoom);
    flash(`Room change applied: ${cls?.shortName} → ${room?.number}. Visible on Classes & Rooms pages.`);
    setRoomChangeClass('');
    setRoomChangeNewRoom('');
    setRoomChangeConfirm(false);
  };

  // --- Timetable reschedule ---
  const selectedSlot = TIMETABLE.find((t) => t.id === ttSlotId);
  const handleTimetableOverride = () => {
    if (!ttSlotId) return;
    const changes = {};
    if (ttNewStart) changes.startTime = ttNewStart;
    if (ttNewEnd) changes.endTime = ttNewEnd;
    if (ttNewRoom) changes.roomId = ttNewRoom;
    applyTimetableOverride(ttSlotId, changes);
    flash('Timetable slot updated. Reflected on Timetable page.');
    setTtSlotId(''); setTtNewStart(''); setTtNewEnd(''); setTtNewRoom('');
    setTtConfirm(false);
  };

  // --- Announcements ---
  const handleAddAnnouncement = () => {
    if (!annText.trim()) return;
    addAnnouncement(annText.trim(), annSeverity);
    setAnnText('');
    flash('Announcement broadcast to marquee and dashboard.');
  };

  const stats = [
    { label: 'Buildings', value: BUILDINGS.length, color: 'var(--navigo-yellow)' },
    { label: 'Faculty', value: FACULTY.length, color: 'var(--navigo-green)' },
    { label: 'Rooms', value: ROOMS.length, color: '#3157FF' },
    { label: 'Classes', value: CLASSES.length, color: '#FF4757' },
    { label: 'Events', value: events.length, color: '#747DFF' },
  ];

  const TABS = [
    { id: 'events', label: 'Events' },
    { id: 'locations', label: 'Locations' },
    { id: 'rooms', label: 'Room Changes' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'announce', label: 'Announcements' },
    { id: 'data', label: 'Data Overview' },
  ];

  return (
    <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] text-[var(--navigo-yellow)] uppercase tracking-widest">[ADMIN_PANEL]</span>
          <span className="font-mono text-[9px] border border-[#FF4757] text-[#FF4757] px-2 py-0.5">
            SESSION LOCAL — CHANGES NOT PERSISTED
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">
          Admin Panel.
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Manage campus data. Changes propagate live to public pages within this session.
        </p>
      </div>

      {/* Success flash */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-3 border border-[var(--navigo-green)] bg-[var(--navigo-green)]/10 px-4 py-3 rounded-2xl glass-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--navigo-green)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span className="font-mono text-sm text-[var(--navigo-green)]">{successMsg}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="glass-card border border-[var(--glass-border)] px-4 py-3 rounded-2xl flex items-center gap-3">
            <div>
              <p className="font-mono text-[8px] text-[var(--text-muted)] uppercase tracking-widest leading-none mb-1">{s.label}</p>
              <p className="font-display text-xl font-bold leading-none" style={{ color: s.color }}>
                {String(s.value).padStart(2, '0')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Active announcements banner */}
      {announcements.length > 0 && (
        <div className="mb-6 border border-[#FF4757] p-4 bg-[#FF4757]/10 rounded-2xl glass-2">
          <p className="font-mono text-[9px] text-[#FF4757] uppercase tracking-widest mb-2 font-bold">
            {announcements.length} Active Broadcast{announcements.length > 1 ? 's' : ''}
          </p>
          <div className="flex flex-col gap-2">
            {announcements.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-[#FF4757]">[{a.severity}] {a.text}</span>
                <button
                  onClick={() => removeAnnouncement(a.id)}
                  className="font-mono text-[9px] px-2 py-0.5 border border-[#FF4757] text-[#FF4757] hover:bg-[#FF4757] hover:text-white transition-colors shrink-0"
                  aria-label="Remove announcement"
                >
                  REVOKE
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <GlassTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="gold"
        />
      </div>

      {/* ── Events Tab ── */}
      {activeTab === 'events' && (
        <div className="glass-card rounded-2xl overflow-hidden border border-[var(--glass-border)] mb-6 shadow-lg">
          <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-[var(--glass-border)] w-full">
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-tight text-[var(--text-primary)]">
                Events Management
              </h2>
              <p className="font-mono text-[10px] text-[var(--text-muted)] mt-1">{events.length} events in system</p>
            </div>

            <button
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="glass-btn rounded-lg px-5 py-2.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 font-bold text-xs tracking-wide"
              style={{
                background: showAddEvent
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'var(--gold-light)',
                color: showAddEvent ? 'var(--red)' : 'var(--gold)',
                border: `1px solid ${showAddEvent ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 122, 255, 0.3)'}`,
              }}
              aria-label={showAddEvent ? 'Cancel adding event' : 'Add event'}
            >
              {showAddEvent ? (
                <><X size={14} className="shrink-0 transition-transform duration-200 hover:rotate-90" /><span>Cancel</span></>
              ) : (
                <><Pencil size={13} className="shrink-0 transition-transform duration-300" /><span>+ Add Event</span></>
              )}
            </button>
          </div>

          {showAddEvent && (
            <div className="p-5 border-b border-[var(--glass-border)] glass-1">
              <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-4">New Event</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Title *</label>
                  <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Event title" className="input-field" />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Category</label>
                  <select value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} className="input-field glass-select appearance-none cursor-pointer">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Date * (YYYY.MM.DD)</label>
                  <input type="text" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} placeholder="2026.12.01" className="input-field font-mono" />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Time *</label>
                  <input type="text" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} placeholder="10:00 AM" className="input-field font-mono" />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Venue</label>
                  <select value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} className="input-field glass-select appearance-none cursor-pointer">
                    {BUILDINGS.filter((b) => b.type !== 'gate').map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Description</label>
                  <input type="text" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} placeholder="Short description" className="input-field" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleAddEvent} disabled={!newEvent.title || !newEvent.date || !newEvent.time} className="btn-primary text-xs py-2 px-6 disabled:opacity-40">
                  Save Event
                </button>
                <button onClick={() => setShowAddEvent(false)} className="btn-secondary text-xs py-2 px-4">Cancel</button>
              </div>
            </div>
          )}

          <div>
            {events.map((event, idx) => (
              <div
                key={event.id}
                className={`flex items-start gap-4 px-5 py-4 border-b border-[#E5E7EB] dark:border-[#2A2A2A] ${
                  idx % 2 === 0 ? 'bg-white dark:bg-[#141414]' : 'bg-[#FAFAFA] dark:bg-[#111111]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-mono text-[9px] px-1.5 py-0.5 border border-current text-[var(--navigo-yellow)]">{event.category}</span>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 ${event.status === 'UPCOMING' ? 'bg-[var(--navigo-yellow)]/20 text-[var(--navigo-yellow)]' : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-500'}`}>{event.status}</span>
                    {event.id.startsWith('custom_') && (
                      <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[var(--navigo-green)]/20 text-[var(--navigo-green)]">NEW</span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm">{event.title}</h4>
                  <p className="font-mono text-[10px] text-gray-500">{event.date} · {event.time} · {event.venueName}</p>
                </div>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#FF4757] hover:bg-[#FF4757]/15 transition-all duration-200 hover:scale-110"
                  aria-label={`Delete ${event.title}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Locations Management Tab ── */}
      {activeTab === 'locations' && (
        <div className="glass-card rounded-2xl overflow-hidden border border-[var(--glass-border)] mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-[var(--glass-border)] w-full glass-2">
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-tight text-[var(--text-primary)]">
                Location & Venue Management
              </h2>
              <p className="font-mono text-[10px] text-[var(--text-muted)] mt-1">
                Deactivate or reopen campus facilities. Deactivation automatically validates and warns about affected scheduled events.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] px-2.5 py-1 rounded-md border border-[var(--glass-border)] text-[var(--text-muted)]">
                {Object.values(locationStatus).filter(s => s === 'closed').length} Closed
              </span>
              <span className="font-mono text-[10px] px-2.5 py-1 rounded-md border border-emerald-500/30 text-emerald-500 bg-emerald-500/10">
                {BUILDINGS.filter(b => b.type !== 'gate').length - Object.values(locationStatus).filter(s => s === 'closed').length} Operational
              </span>
            </div>
          </div>

          <div className="divide-y divide-[var(--glass-border)]">
            {BUILDINGS.filter(b => b.type !== 'gate').map((b, idx) => {
              const isClosed = locationStatus[b.id] === 'closed';
              const linkedEvents = events.filter((e) => e.venue === b.id);

              return (
                <div
                  key={b.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 transition-colors ${
                    idx % 2 === 0 ? 'bg-white/50 dark:bg-[#141414]/50' : 'bg-[#FAFAFA]/50 dark:bg-[#111111]/50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded-md border border-[var(--glass-border)] text-[var(--text-muted)] uppercase">
                        {b.type} · {b.code}
                      </span>
                      {isClosed ? (
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded-md font-bold bg-red-500/20 text-red-500 border border-red-500/40">
                          CLOSED / MAINTENANCE
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded-md font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/40">
                          OPERATIONAL
                        </span>
                      )}
                      {linkedEvents.length > 0 && (
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded-md bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30 font-bold">
                          {linkedEvents.length} Active Event{linkedEvents.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{b.label}</h4>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">
                      {b.department} · {b.facilities.slice(0, 3).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleLocation(b)}
                      className={`font-mono text-xs px-4 py-2 rounded-lg font-bold transition-all ${
                        isClosed
                          ? 'glass-btn glass-btn-primary'
                          : 'border border-red-500/40 text-red-500 hover:bg-red-500/15'
                      }`}
                      aria-label={`${isClosed ? 'Reopen' : 'Deactivate'} ${b.label}`}
                    >
                      {isClosed ? 'Reopen Location' : 'Deactivate (Mark Closed)'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Room Changes Tab ── */}
      {activeTab === 'rooms' && (
        <div className="glass-card rounded-2xl overflow-hidden border border-[var(--glass-border)] mb-6 shadow-lg">
          <div className="px-6 py-4.5 border-b border-[var(--glass-border)] glass-2">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-[var(--text-primary)]">Room Change</h2>
            <p className="font-mono text-[10px] text-gray-500 mt-0.5">Reassign a class to a different room — propagates to Classes, Rooms, and Timetable pages</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Class</label>
                <select
                  value={roomChangeClass}
                  onChange={(e) => { setRoomChangeClass(e.target.value); setRoomChangeConfirm(false); }}
                  className="input-field glass-select appearance-none cursor-pointer"
                >
                  <option value="">— Select Class —</option>
                  {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">New Room</label>
                <select
                  value={roomChangeNewRoom}
                  onChange={(e) => { setRoomChangeNewRoom(e.target.value); setRoomChangeConfirm(false); }}
                  className="input-field glass-select appearance-none cursor-pointer"
                >
                  <option value="">— Select Room —</option>
                  {ROOMS.map((r) => <option key={r.id} value={r.id}>{r.number} — {r.building} ({r.type})</option>)}
                </select>
              </div>
            </div>

            {roomChangeClass && roomChangeNewRoom && !roomChangeConfirm && (
              <div className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-4 mb-4">
                <p className="font-mono text-xs mb-3 text-[var(--text-primary)]">
                  <span className="font-bold">{getClassById(roomChangeClass)?.name}</span>
                  {' → '}
                  <span className="font-bold">{getRoomById(roomChangeNewRoom)?.number}</span>
                  , effective immediately
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setRoomChangeConfirm(true)} className="glass-btn glass-btn-primary rounded-lg text-xs py-2 px-5 font-bold">CONFIRM</button>
                  <button onClick={() => { setRoomChangeClass(''); setRoomChangeNewRoom(''); }} className="glass-btn glass-btn-ghost rounded-lg text-xs py-2 px-4">CANCEL</button>
                </div>
              </div>
            )}

            {roomChangeConfirm && (
              <button onClick={handleRoomChange} className="glass-btn glass-btn-primary rounded-lg text-xs py-2.5 px-6 font-bold shadow-md">
                Apply Room Change
              </button>
            )}

            {/* Active overrides */}
            {Object.keys(roomOverrides).length > 0 && (
              <div className="mt-6">
                <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Active Room Overrides</p>
                <div className="rounded-xl border border-[var(--glass-border)] overflow-hidden divide-y divide-[var(--glass-border)] glass-1">
                  {Object.entries(roomOverrides).map(([classId, roomId]) => {
                    const cls = getClassById(classId);
                    const room = getRoomById(roomId);
                    return (
                      <div key={classId} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <span className="font-bold text-sm text-[var(--text-primary)]">{cls?.shortName}</span>
                          <span className="font-mono text-xs text-gray-400 ml-2">→ {room?.number}</span>
                        </div>
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded-md bg-[var(--gold)]/20 text-[var(--gold)] font-bold">ACTIVE</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Timetable Tab ── */}
      {activeTab === 'timetable' && (
        <div className="glass-card rounded-2xl overflow-hidden border border-[var(--glass-border)] mb-6 shadow-lg">
          <div className="px-6 py-4.5 border-b border-[var(--glass-border)] glass-2">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-[var(--text-primary)]">Timetable Reschedule</h2>
            <p className="font-mono text-[10px] text-gray-500 mt-0.5">Override a specific timetable slot&apos;s time or room</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Select Slot</label>
                <select
                  value={ttSlotId}
                  onChange={(e) => { setTtSlotId(e.target.value); setTtConfirm(false); }}
                  className="input-field glass-select appearance-none cursor-pointer"
                >
                  <option value="">— Select a timetable slot —</option>
                  {TIMETABLE.map((t) => {
                    const cls = getClassById(t.classId);
                    return (
                      <option key={t.id} value={t.id}>
                        {cls?.shortName} — {t.day} {t.startTime}–{t.endTime} — {t.subject}
                      </option>
                    );
                  })}
                </select>
              </div>

              {ttSlotId && (
                <>
                  <div>
                    <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                      New Start Time (leave blank to keep {selectedSlot?.startTime})
                    </label>
                    <input type="text" value={ttNewStart} onChange={(e) => setTtNewStart(e.target.value)} placeholder={selectedSlot?.startTime} className="input-field font-mono" />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                      New End Time (leave blank to keep {selectedSlot?.endTime})
                    </label>
                    <input type="text" value={ttNewEnd} onChange={(e) => setTtNewEnd(e.target.value)} placeholder={selectedSlot?.endTime} className="input-field font-mono" />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">New Room (optional)</label>
                    <select value={ttNewRoom} onChange={(e) => setTtNewRoom(e.target.value)} className="input-field glass-select appearance-none cursor-pointer">
                      <option value="">— Keep current room —</option>
                      {ROOMS.map((r) => <option key={r.id} value={r.id}>{r.number} — {r.building}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>

            {ttSlotId && (ttNewStart || ttNewEnd || ttNewRoom) && !ttConfirm && (
              <div className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-4 mb-4">
                <p className="font-mono text-xs mb-3 text-[var(--text-primary)]">
                  Reschedule <span className="font-bold">{selectedSlot?.subject}</span>
                  {ttNewStart ? ` to ${ttNewStart}` : ''}{ttNewEnd ? `–${ttNewEnd}` : ''}
                  {ttNewRoom ? `, room → ${getRoomById(ttNewRoom)?.number}` : ''}
                  , effective immediately
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setTtConfirm(true)} className="glass-btn glass-btn-primary rounded-lg text-xs py-2 px-5 font-bold">CONFIRM</button>
                  <button onClick={() => { setTtSlotId(''); setTtNewStart(''); setTtNewEnd(''); setTtNewRoom(''); }} className="glass-btn glass-btn-ghost rounded-lg text-xs py-2 px-4">CANCEL</button>
                </div>
              </div>
            )}

            {ttConfirm && (
              <button onClick={handleTimetableOverride} className="glass-btn glass-btn-primary rounded-lg text-xs py-2.5 px-6 font-bold shadow-md">
                Apply Reschedule
              </button>
            )}

            {Object.keys(timetableOverrides).length > 0 && (
              <div className="mt-6">
                <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Active Timetable Overrides</p>
                <div className="rounded-xl border border-[var(--glass-border)] overflow-hidden divide-y divide-[var(--glass-border)] glass-1">
                  {Object.entries(timetableOverrides).map(([slotId, changes]) => {
                    const slot = TIMETABLE.find((t) => t.id === slotId);
                    return (
                      <div key={slotId} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <span className="font-bold text-sm text-[var(--text-primary)]">{slot?.subject}</span>
                          <span className="font-mono text-xs text-gray-400 ml-2">
                            {changes.startTime || slot?.startTime}–{changes.endTime || slot?.endTime}
                            {changes.roomId ? ` → ${getRoomById(changes.roomId)?.number}` : ''}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded-md bg-[var(--gold)]/20 text-[var(--gold)] font-bold">OVERRIDDEN</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Announcements Tab ── */}
      {activeTab === 'announce' && (
        <div className="glass-card rounded-2xl overflow-hidden border border-[var(--glass-border)] mb-6 shadow-lg">
          <div className="px-6 py-4.5 border-b border-[var(--glass-border)] glass-2">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-[var(--text-primary)]">Broadcast Announcement</h2>
            <p className="font-mono text-[10px] text-gray-500 mt-0.5">Message appears in the marquee ticker and dashboard banner across all pages</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Message *</label>
                <input
                  type="text"
                  value={annText}
                  onChange={(e) => setAnnText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAnnouncement()}
                  placeholder="e.g. CLASS A-301 CANCELLED TODAY"
                  className="input-field"
                />
              </div>
              <div>
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Severity</label>
                <select value={annSeverity} onChange={(e) => setAnnSeverity(e.target.value)} className="input-field glass-select appearance-none cursor-pointer">
                  {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleAddAnnouncement} disabled={!annText.trim()} className="glass-btn glass-btn-primary rounded-lg text-xs py-2.5 px-6 font-bold shadow-md disabled:opacity-40">
              Broadcast Now
            </button>

            {announcements.length > 0 && (
              <div className="mt-6">
                <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Live Broadcasts ({announcements.length})</p>
                <div className="rounded-xl border border-red-500/30 overflow-hidden divide-y divide-red-500/20 bg-red-500/5">
                  {announcements.map((a) => (
                    <div key={a.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded-md border border-red-500 text-red-500 mr-2 font-bold">{a.severity}</span>
                        <span className="font-mono text-sm text-[var(--text-primary)]">{a.text}</span>
                      </div>
                      <button
                        onClick={() => removeAnnouncement(a.id)}
                        className="font-mono text-[9px] px-2.5 py-1 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-3 shrink-0 font-bold"
                      >
                        REVOKE
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {announcements.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-[var(--glass-border)] p-8 text-center glass-1">
                <p className="font-mono text-xs uppercase tracking-wider text-gray-400">No active broadcasts</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Data Overview Tab ── */}
      {activeTab === 'data' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buildings */}
          <div className="glass-card rounded-2xl overflow-hidden border border-[var(--glass-border)] shadow-lg">
            <div className="px-5 py-3.5 border-b border-[var(--glass-border)] glass-2 flex justify-between items-center">
              <h3 className="font-bold text-sm uppercase tracking-tight text-[var(--text-primary)]">Buildings</h3>
              <p className="font-mono text-[9px] text-gray-400">Read-only</p>
            </div>
            <div className="divide-y divide-[var(--glass-border)] glass-1 max-h-96 overflow-y-auto scrollbar-thin">
              {BUILDINGS.filter((b) => b.type !== 'gate').map((b) => (
                <div key={b.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{b.label}</p>
                    <p className="font-mono text-[9px] text-gray-500">{b.code} · {b.type}</p>
                  </div>
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 font-bold ${b.accessible ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {b.accessible ? '♿ YES' : '♿ NO'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty */}
          <div className="glass-card rounded-2xl overflow-hidden border border-[var(--glass-border)] shadow-lg">
            <div className="px-5 py-3.5 border-b border-[var(--glass-border)] glass-2 flex justify-between items-center">
              <h3 className="font-bold text-sm uppercase tracking-tight text-[var(--text-primary)]">Faculty</h3>
              <p className="font-mono text-[9px] text-gray-400">Read-only</p>
            </div>
            <div className="divide-y divide-[var(--glass-border)] glass-1 max-h-96 overflow-y-auto scrollbar-thin">
              {FACULTY.map((f) => (
                <div key={f.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{f.name}</p>
                    <p className="font-mono text-[9px] text-gray-500">{f.designation}</p>
                  </div>
                  <p className="font-mono text-[9px] text-gray-400 max-w-[120px] text-right truncate">{f.department}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Deactivation Confirmation Warning Modal */}
      {deactivationWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="glass-card w-full max-w-lg rounded-xl p-6 sm:p-7 border border-red-500/40 shadow-2xl relative text-left">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/40 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-tight">
                  Deactivation Warning: Active Events Scheduled
                </h3>
                <p className="font-mono text-xs text-red-500 mt-1 font-semibold">
                  Location &quot;{deactivationWarning.building.label}&quot; is currently referenced by {deactivationWarning.referencedEvents.length} scheduled event{deactivationWarning.referencedEvents.length > 1 ? 's' : ''}.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 mb-4 space-y-2">
              <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                Affected Scheduled Events:
              </p>
              <ul className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-thin">
                {deactivationWarning.referencedEvents.map((ev) => (
                  <li key={ev.id} className="text-xs flex items-center justify-between gap-2 border-b border-red-500/10 pb-1">
                    <span className="font-bold text-[var(--text-primary)]">{ev.title}</span>
                    <span className="font-mono text-[10px] text-gray-400 shrink-0">{ev.date} · {ev.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              Deactivating this location will flag all referenced events on the public Events page and Directory with a temporary venue closure warning. Are you sure you want to proceed?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={cancelDeactivation}
                className="glass-btn glass-btn-ghost rounded-lg px-5 py-2.5 text-xs font-bold"
              >
                Cancel (Keep Operational)
              </button>
              <button
                onClick={confirmDeactivation}
                className="rounded-lg px-5 py-2.5 text-xs font-bold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-md"
              >
                Proceed with Deactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

