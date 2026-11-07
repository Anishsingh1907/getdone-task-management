import React, { useState } from 'react';
import { Plus, X, Calendar, MapPin, Tag, FileText, Check } from 'lucide-react';

export default function TaskForm({
  user,
  allUsers = [],
  allowedStatuses = [],
  onCreateTask,
}) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [taskType, setTaskType] = useState('Project');
  const [status, setStatus] = useState(allowedStatuses[0] || 'ongoing');
  const [tag, setTag] = useState('UI Design');
  const [location, setLocation] = useState('Alpha team lead');
  const [dueDate, setDueDate] = useState('2026-11-28');
  const [estimatedHours, setEstimatedHours] = useState('5.0');
  const [selectedAssignees, setSelectedAssignees] = useState(
    user?.role === 'Employee' ? [user.id] : ['user_4']
  );

  const taskTypes = ['Project', 'Meeting', 'Alpha Team', 'Daily Routine', 'Sprint'];

  const toggleAssignee = (id) => {
    setSelectedAssignees((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      title: title.trim(),
      desc: desc.trim(),
      taskType,
      status,
      tag,
      location,
      dueDate,
      estimatedHours: parseFloat(estimatedHours) || 5,
      assignees: selectedAssignees,
    });

    // Reset fields
    setTitle('');
    setDesc('');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Create a new task</h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Title Input */}
        <div>
          <label style={styles.label}>Title</label>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Brief project with Stella Alpha"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
            />
            {title && (
              <button
                type="button"
                onClick={() => setTitle('')}
                style={styles.clearBtn}
              >
                <X size={14} color="#94a3b8" />
              </button>
            )}
          </div>
        </div>

        {/* Task Type Chips */}
        <div>
          <label style={styles.label}>Task type</label>
          <div style={styles.chipsContainer}>
            {taskTypes.map((type) => {
              const active = taskType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTaskType(type)}
                  style={{
                    ...styles.chip,
                    backgroundColor: active ? '#3157d5' : '#f1f3f7',
                    color: active ? '#ffffff' : '#475569',
                    fontWeight: active ? '700' : '500',
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Task Details Header */}
        <div style={{ marginTop: '6px' }}>
          <span style={{ ...styles.label, marginBottom: '8px', display: 'block' }}>
            Task details
          </span>

          {/* Date & Hours Row */}
          <div style={styles.detailRow}>
            <Calendar size={15} color="#94a3b8" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={styles.detailInput}
            />
            <input
              type="number"
              step="0.5"
              placeholder="Hours"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              style={{ ...styles.detailInput, width: '70px', textAlign: 'center' }}
            />
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>hrs</span>
          </div>

          {/* Assignees Avatars Selection */}
          <div style={styles.assigneesBox}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}>
              Assign to:
            </span>
            <div style={styles.assigneesRow}>
              {allUsers.map((u) => {
                const isSelected = selectedAssignees.includes(u.id);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleAssignee(u.id)}
                    style={{
                      ...styles.assigneeBtn,
                      border: isSelected ? '2px solid #3157d5' : '2px solid transparent',
                    }}
                    title={`${u.name} (${u.role})`}
                  >
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} style={styles.avatarImg} />
                    ) : (
                      <div style={styles.avatarFallback}>{getInitials(u.name)}</div>
                    )}
                    {isSelected && (
                      <div style={styles.checkBadge}>
                        <Check size={8} color="#fff" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tag / Category */}
          <div style={styles.detailRow}>
            <Tag size={15} color="#94a3b8" />
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              style={styles.detailSelect}
            >
              <option value="UI Design">UI Design</option>
              <option value="Backend">Backend</option>
              <option value="Fullstack">Fullstack</option>
              <option value="HR Tech">HR Tech</option>
              <option value="Operations">Operations</option>
              <option value="Mobile">Mobile</option>
              <option value="Management">Management</option>
            </select>
          </div>

          {/* Status */}
          <div style={styles.detailRow}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', width: '15px' }}>
              ●
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={styles.detailSelect}
            >
              {allowedStatuses.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div style={styles.detailRow}>
            <MapPin size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Add Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={styles.detailInput}
            />
          </div>

          {/* Description */}
          <div style={{ ...styles.detailRow, alignItems: 'flex-start' }}>
            <FileText size={15} color="#94a3b8" style={{ marginTop: '6px' }} />
            <textarea
              placeholder="Add description..."
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              style={styles.textarea}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!title.trim()}
          style={{
            ...styles.submitBtn,
            opacity: title.trim() ? 1 : 0.6,
            cursor: title.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          <Plus size={16} />
          <span>Create Task</span>
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '20px',
    border: '1px solid #edf0f7',
    marginBottom: '20px',
  },
  title: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#191d31',
    marginBottom: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    marginBottom: '6px',
    display: 'block',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '10px 32px 10px 14px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '13px',
    color: '#191d31',
    backgroundColor: '#f8fafc',
  },
  clearBtn: {
    position: 'absolute',
    right: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  chip: {
    padding: '6px 12px',
    borderRadius: '99px',
    fontSize: '11px',
    transition: 'all 0.15s ease',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f8fafc',
    padding: '8px 12px',
    borderRadius: '10px',
    marginBottom: '8px',
    border: '1px solid #edf0f7',
  },
  detailInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '12px',
    color: '#191d31',
  },
  detailSelect: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '12px',
    fontWeight: '600',
    color: '#191d31',
    cursor: 'pointer',
  },
  assigneesBox: {
    backgroundColor: '#f8fafc',
    padding: '10px 12px',
    borderRadius: '10px',
    marginBottom: '8px',
    border: '1px solid #edf0f7',
  },
  assigneesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '6px',
  },
  assigneeBtn: {
    position: 'relative',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    padding: 0,
    backgroundColor: 'transparent',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#3157d5',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: '11px',
    fontWeight: '700',
  },
  checkBadge: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '14px',
    height: '14px',
    backgroundColor: '#3157d5',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    border: '1.5px solid #fff',
  },
  textarea: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '12px',
    color: '#191d31',
    resize: 'none',
  },
  submitBtn: {
    backgroundColor: '#3157d5',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '13px',
    padding: '12px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(49, 87, 213, 0.25)',
    transition: 'background 0.15s ease',
  },
};

