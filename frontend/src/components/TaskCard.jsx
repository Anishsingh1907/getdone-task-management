import React from 'react';
import { MessageSquare, Paperclip, Clock, Trash2, Edit3, ShieldAlert } from 'lucide-react';

export default function TaskCard({
  task,
  user,
  allUsers = [],
  allowedStatuses = [],
  canHardDelete = false,
  onStatusChange,
  onEdit,
  onTempDelete,
  onPermanentDelete,
}) {
  const getAssignee = (id) => allUsers.find((u) => u.id === id);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const tagColors = {
    'UI Design': { bg: '#fee2e2', text: '#ef4444' },
    'Backend': { bg: '#e0e7ff', text: '#4338ca' },
    'Fullstack': { bg: '#e0f2fe', text: '#0284c7' },
    'HR Tech': { bg: '#fef3c7', text: '#d97706' },
    'Operations': { bg: '#f3e8ff', text: '#7e22ce' },
    'Mobile': { bg: '#dcfce7', text: '#16a34a' },
    'Management': { bg: '#ffedd5', text: '#ea580c' },
  };

  const currentTagStyle = tagColors[task.tag] || { bg: '#f1f5f9', text: '#475569' };

  return (
    <div style={styles.card} className="fade-in">
      {/* Top Header: Tag & Actions */}
      <div style={styles.topRow}>
        <span
          style={{
            ...styles.tag,
            backgroundColor: currentTagStyle.bg,
            color: currentTagStyle.text,
          }}
        >
          {task.tag || 'Task'}
        </span>

        <div style={styles.actionBtns}>
          <button
            onClick={() => onEdit(task)}
            style={styles.iconBtn}
            title="Edit Task"
          >
            <Edit3 size={14} color="#64748b" />
          </button>
          <button
            onClick={() => onTempDelete(task.id)}
            style={styles.iconBtn}
            title="Move to Trash (Soft Delete)"
          >
            <Trash2 size={14} color="#ef4444" />
          </button>
          {canHardDelete && (
            <button
              onClick={() => onPermanentDelete(task.id, task.title)}
              style={{ ...styles.iconBtn, backgroundColor: '#fef2f2' }}
              title="Permanent Delete (Owner & HR Only)"
            >
              <ShieldAlert size={14} color="#b91c1c" />
            </button>
          )}
        </div>
      </div>

      {/* Task Title */}
      <h3 style={styles.title}>{task.title}</h3>

      {/* Description */}
      <p style={styles.desc}>{task.desc || 'No description provided.'}</p>

      {/* Status Picker Pill */}
      <div style={styles.statusRow}>
        <span style={styles.statusLabel}>Status:</span>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          style={styles.statusSelect}
        >
          {allowedStatuses.map((s) => (
            <option key={s} value={s}>
              {s === 'pending'
                ? 'Coming Next'
                : s === 'ongoing'
                ? 'In Progress'
                : s === 'yetToFinal'
                ? 'Yet To Final'
                : 'Completed'}
            </option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Bottom Row: Assignee Avatars & Meta Stats */}
      <div style={styles.bottomRow}>
        {/* Assignee Stack */}
        <div style={styles.avatarStack}>
          {task.assignees && task.assignees.length > 0 ? (
            task.assignees.map((id, idx) => {
              const u = getAssignee(id);
              return (
                <div
                  key={id || idx}
                  style={{
                    ...styles.avatar,
                    marginLeft: idx > 0 ? '-8px' : '0',
                    zIndex: 10 - idx,
                  }}
                  title={u ? `${u.name} (${u.role})` : `User ${id}`}
                >
                  {u?.avatar ? (
                    <img src={u.avatar} alt={u.name} style={styles.avatarImg} />
                  ) : (
                    <span>{getInitials(u?.name)}</span>
                  )}
                </div>
              );
            })
          ) : (
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Unassigned</span>
          )}
        </div>

        {/* Meta Stats: Comments, Attachments, Hours */}
        <div style={styles.metaRow}>
          <div style={styles.metaItem} title="Comments">
            <MessageSquare size={13} color="#94a3b8" />
            <span>{task.commentsCount || 0}</span>
          </div>

          <div style={styles.metaItem} title="Attachments">
            <Paperclip size={13} color="#94a3b8" />
            <span>{task.attachmentsCount || 0}</span>
          </div>

          <div style={styles.metaItem} title="Estimated Hours">
            <Clock size={13} color="#94a3b8" />
            <span>{task.estimatedHours || 4}h</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid #edf0f7',
    marginBottom: '14px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
    transition: 'all 0.15s ease',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  tag: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: '99px',
    letterSpacing: '0.2px',
  },
  actionBtns: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  iconBtn: {
    width: '26px',
    height: '26px',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #edf0f7',
    transition: 'background 0.15s',
  },
  title: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#191d31',
    lineHeight: '1.3',
    marginBottom: '6px',
  },
  desc: {
    fontSize: '12px',
    color: '#787f95',
    lineHeight: '1.45',
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  statusLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#94a3b8',
  },
  statusSelect: {
    padding: '4px 8px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#3157d5',
    backgroundColor: '#ebf0ff',
    border: 'none',
    cursor: 'pointer',
  },
  divider: {
    height: '1px',
    backgroundColor: '#f1f3f7',
    marginBottom: '12px',
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarStack: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#3157d5',
    color: '#ffffff',
    border: '2px solid #ffffff',
    display: 'grid',
    placeItems: 'center',
    fontSize: '10px',
    fontWeight: '700',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#94a3b8',
  },
};

