import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function EditModal({
  task,
  user,
  allUsers = [],
  allowedStatuses = [],
  onSave,
  onClose,
}) {
  const [title, setTitle] = useState(task.title || '');
  const [desc, setDesc] = useState(task.desc || '');
  const [status, setStatus] = useState(task.status || allowedStatuses[0]);
  const [tag, setTag] = useState(task.tag || 'UI Design');
  const [estimatedHours, setEstimatedHours] = useState(task.estimatedHours || 5);
  const [assignees, setAssignees] = useState(task.assignees || []);

  const toggleAssignee = (id) => {
    setAssignees((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...task,
      title: title.trim(),
      desc: desc.trim(),
      status,
      tag,
      estimatedHours: parseFloat(estimatedHours) || 5,
      assignees,
    });
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
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()} className="fade-in">
        {/* Modal Header */}
        <div style={styles.header}>
          <h3 style={styles.title}>Edit Project / Task</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} color="#64748b" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div>
            <label style={styles.label}>Description</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <div style={styles.twoCol}>
            <div>
              <label style={styles.label}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={styles.select}
              >
                {allowedStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>Tag / Department</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                style={styles.select}
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
          </div>

          <div>
            <label style={styles.label}>Estimated Hours</label>
            <input
              type="number"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Assignees Selector */}
          <div>
            <label style={styles.label}>Assignees</label>
            <div style={styles.assigneesRow}>
              {allUsers.map((u) => {
                const isSelected = assignees.includes(u.id);
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

          {/* Action Buttons */}
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '24px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '18px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#191d31',
  },
  closeBtn: {
    padding: '4px',
    borderRadius: '8px',
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
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '13px',
    color: '#191d31',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '13px',
    color: '#191d31',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '13px',
    color: '#191d31',
    backgroundColor: '#fff',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  assigneesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  assigneeBtn: {
    position: 'relative',
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    padding: 0,
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
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '10px 16px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
  },
  saveBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#3157d5',
  },
};

