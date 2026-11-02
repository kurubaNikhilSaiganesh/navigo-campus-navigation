// NoticesView — campus notice board with Live Announcements & Instant Delete

import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { GlassBadge } from './ui/GlassBadge';
import { Bell, RotateCcw, Check, Plus, X, Trash2 } from 'lucide-react';

const SEVERITY_CONFIG = {
  ALERT:     { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',   badge: 'red',  icon: '⚠' },
  NOTICE:    { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',  badge: 'blue', icon: '📢' },
  DEADLINE:  { color: '#F97316', bg: 'rgba(249,115,22,0.08)',  badge: 'gold', icon: '📅' },
  UPDATE:    { color: '#10B981', bg: 'rgba(16,185,129,0.08)',  badge: 'green',icon: '✅' },
  EMERGENCY: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   badge: 'red',  icon: '🚨' },
};

const DEFAULT_NOTICES = [
  {
    id: 'n_default_0',
    text: 'TOMORROW: Annual Mini Project Expo starts at 09:30 AM in Auditorium & CSE Labs. All batches must register with project models.',
    severity: 'UPDATE',
    timestamp: '2026-10-30T10:00:00.000Z',
  },
  {
    id: 'n_default_1',
    text: 'Mid Examination 1 date sheet has been released. Check the Exams section for the full schedule.',
    severity: 'NOTICE',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'n_default_2',
    text: 'Last date for internal marks correction: 30 September 2026. Contact your respective department.',
    severity: 'DEADLINE',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'n_default_3',
    text: 'Library will remain closed on 25 September 2026 for maintenance.',
    severity: 'ALERT',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

function NoticeCard({ notice, onDelete }) {
  const cfg = SEVERITY_CONFIG[notice.severity] || SEVERITY_CONFIG.NOTICE;
  const date = new Date(notice.timestamp).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const time = new Date(notice.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div
      className="glass-card overflow-hidden rounded-xl border border-[var(--glass-border)] hover:border-violet-500/30 transition-all duration-200"
      style={{ borderLeft: `4px solid ${cfg.color}` }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base">{cfg.icon}</span>
            <GlassBadge variant={cfg.badge}>{notice.severity}</GlassBadge>
            {notice.isCustom && (
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-[#6EE7B7] border border-emerald-500/30 font-bold">
                NEW UPDATE
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-[9.5px] text-[var(--text-muted)] hidden sm:inline">
              {date} · {time}
            </span>
            {/* Instant Delete Button on Every Notice */}
            {onDelete && (
              <button
                onClick={() => onDelete(notice.id, notice.isCustom)}
                className="flex items-center gap-1 font-mono text-[10.5px] text-red-400 hover:text-red-300 hover:bg-red-500/15 px-2.5 py-1 rounded-lg border border-red-500/25 transition-all shadow-sm active:scale-95"
                title="Delete this notice immediately"
              >
                <Trash2 size={12} className="shrink-0" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
          {notice.text}
        </p>
      </div>
    </div>
  );
}

export default function NoticesView() {
  const { announcements, addAnnouncement, removeAnnouncement, resetNoticesToDefault, hasCustomNotices } = useContext(AppContext);
  const [csvStatus, setCsvStatus] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [noticeText, setNoticeText] = useState('');
  const [noticeSeverity, setNoticeSeverity] = useState('NOTICE');

  // Track deleted default notices in localStorage
  const [deletedNoticeIds, setDeletedNoticeIds] = useState(() => {
    try {
      const saved = localStorage.getItem('alts_deleted_notice_ids_2026');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Merge admin announcements with default notices, admin ones on top
  const customAnnouncements = (announcements || []).map((a) => ({
    id: a.id || `ann_${a.timestamp}`,
    text: a.text,
    severity: a.severity || 'NOTICE',
    timestamp: a.timestamp || new Date().toISOString(),
    isCustom: true,
  }));

  const visibleDefaultNotices = DEFAULT_NOTICES
    .filter((n) => !deletedNoticeIds.includes(n.id))
    .map((n) => ({ ...n, isCustom: false }));

  const all = [...customAnnouncements, ...visibleDefaultNotices];

  // Delete notice handler
  const handleDeleteNotice = (id, isCustom) => {
    if (isCustom) {
      if (removeAnnouncement) removeAnnouncement(id);
    } else {
      const nextDeleted = [...deletedNoticeIds, id];
      setDeletedNoticeIds(nextDeleted);
      try {
        localStorage.setItem('alts_deleted_notice_ids_2026', JSON.stringify(nextDeleted));
      } catch { /* ignore */ }
    }
    setCsvStatus({
      type: 'success',
      message: 'Notice removed successfully from campus board.'
    });
    setTimeout(() => setCsvStatus(null), 3500);
  };

  const handleReset = () => {
    if (resetNoticesToDefault) {
      resetNoticesToDefault();
    }
    setDeletedNoticeIds([]);
    try {
      localStorage.removeItem('alts_deleted_notice_ids_2026');
    } catch { /* ignore */ }
    setCsvStatus({
      type: 'success',
      message: 'Notices restored to default campus circulars.'
    });
    setTimeout(() => setCsvStatus(null), 4000);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!noticeText.trim()) return;

    if (addAnnouncement) {
      addAnnouncement(noticeText.trim(), noticeSeverity);
      setCsvStatus({
        type: 'success',
        message: 'New campus notice published live!'
      });
      setTimeout(() => setCsvStatus(null), 4000);
      setNoticeText('');
      setAddModalOpen(false);
    }
  };

  const hasModifications = hasCustomNotices || deletedNoticeIds.length > 0;

  return (
    <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto page-enter space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/30 text-violet-700 dark:text-[#DDD6FE] font-mono text-[10px] uppercase tracking-widest mb-2 font-bold">
          <Bell size={11} className="text-emerald-600 dark:text-[#6EE7B7]" />
          <span>NOTICES_SYS</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">
          Notices &amp; Bulletins.
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Campus announcements, official circulars, and real-time updates.
        </p>
      </div>

      {/* Status Alert Banner */}
      {csvStatus && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border font-mono text-xs animate-in fade-in ${
            csvStatus.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              : 'bg-red-500/15 border-red-500/40 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {csvStatus.type === 'success' ? <Check size={16} /> : null}
            <span>{csvStatus.message}</span>
          </div>
          <button
            onClick={() => setCsvStatus(null)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Notice Management Bar (Only "+ Post Notice" as requested!) */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-violet-500/25 bg-[var(--bg-surface)] dark:bg-[#12141F]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/30 text-violet-700 dark:text-[#DDD6FE] shrink-0">
            <Bell size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
                Notices &amp; Latest Updates
              </h3>
              {hasCustomNotices && (
                <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-[#6EE7B7] border border-emerald-500/30 font-bold">
                  Live Custom Active
                </span>
              )}
            </div>
            <p className="font-mono text-[10.5px] text-[var(--text-secondary)] mt-0.5">
              Post an instant announcement or delete any notice directly below.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* ONLY "+ Post Notice" button (Extra Download & Upload buttons removed) */}
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 text-neutral-950 font-display font-bold rounded-lg px-4 py-2 text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            <Plus size={15} />
            <span>Post Notice</span>
          </button>

          {/* Reset button if notices were customized or deleted */}
          {hasModifications && (
            <button
              onClick={handleReset}
              className="glass-btn glass-btn-ghost rounded-lg px-2.5 py-2 text-xs font-mono text-red-400 hover:bg-red-500/10 flex items-center gap-1"
              title="Reset notices to default"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Severity legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => (
          <span
            key={key}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33` }}
          >
            {cfg.icon} {key}
          </span>
        ))}
      </div>

      {/* Notice cards list */}
      <div className="space-y-3.5">
        {all.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border border-[var(--glass-border)]">
            <p className="font-mono text-sm text-[var(--text-muted)]">
              No active notices on the campus bulletin board.
            </p>
            {hasModifications && (
              <button
                onClick={handleReset}
                className="mt-3 glass-btn rounded-xl px-4 py-1.5 text-xs text-emerald-700 dark:text-[#6EE7B7]"
              >
                Restore Default Notices
              </button>
            )}
          </div>
        ) : (
          all.map((n) => (
            <NoticeCard
              key={n.id}
              notice={n}
              onDelete={handleDeleteNotice}
            />
          ))
        )}
      </div>

      {/* Quick Post Notice Modal */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="rounded-2xl p-5 sm:p-6 max-w-md w-full border border-violet-500/30 bg-[#12141F] backdrop-blur-2xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--glass-border)] mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6EE7B7]" />
                <h3 className="font-display font-black text-lg text-[var(--text-primary)] uppercase tracking-tight">
                  Post New Notice
                </h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="glass-btn glass-btn-ghost rounded-lg w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1">
                  Severity / Category
                </label>
                <select
                  value={noticeSeverity}
                  onChange={(e) => setNoticeSeverity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1C29] border border-violet-500/30 text-[var(--text-primary)] focus:outline-none focus:border-emerald-400"
                >
                  <option value="NOTICE">📢 NOTICE (General Announcement)</option>
                  <option value="UPDATE">✅ UPDATE (Event / Operational Update)</option>
                  <option value="DEADLINE">📅 DEADLINE (Submission / Exam)</option>
                  <option value="ALERT">⚠ ALERT (Important Notice)</option>
                  <option value="EMERGENCY">🚨 EMERGENCY (Immediate Action)</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1">
                  Notice Content *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type circular or notice details here..."
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-violet-500/30 text-[var(--text-primary)] focus:outline-none focus:border-emerald-400 font-sans resize-none"
                />
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 glass-btn rounded-xl py-2.5 text-xs font-semibold text-[var(--text-muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 text-neutral-950 font-display font-bold rounded-xl py-2.5 text-xs shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
