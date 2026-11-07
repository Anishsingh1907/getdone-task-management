import React from 'react';
import { Trash2, RotateCcw, AlertOctagon, ShieldAlert } from 'lucide-react';

export default function TrashView({
  trashList = [],
  user,
  allUsers = [],
  canHardDelete = false,
  onRestore,
  onHardDelete,
}) {
  const getAssignee = (id) => allUsers.find((u) => u.id === id);

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Trash & Soft-Deleted Items</h2>
          <p style={styles.subtitle}>
            Projects moved to trash are kept here temporarily. Only <strong>Owner</strong> and{' '}
            <strong>HR</strong> have permission to permanently delete records.
          </p>
        </div>
        <div style={styles.badge}>
          <Trash2 size={15} color="#ef4444" />
          <span>{trashList.length} items in trash</span>
        </div>
      </div>

      {trashList.length === 0 ? (
        <div style={styles.empty}>
          <Trash2 size={40} color="#cbd5e1" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Trash is Empty</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Soft-deleted tasks will show up here before being permanently removed.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {trashList.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardTop}>
                <span style={styles.tag}>{item.tag || 'Project'}</span>
                <span style={styles.statusPill}>Status: {item.status}</span>
              </div>

              <h4 style={styles.cardTitle}>{item.title}</h4>
              <p style={styles.cardDesc}>{item.desc || 'No description provided.'}</p>

              <div style={styles.metaRow}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Soft-deleted at:{' '}
                  {item.deletedAt ? new Date(item.deletedAt).toLocaleDateString() : 'Recently'}
                </span>
              </div>

              <div style={styles.divider} />

              <div style={styles.actionsRow}>
                {/* Restore Button */}
                <button onClick={() => onRestore(item.id)} style={styles.restoreBtn}>
                  <RotateCcw size={14} />
                  <span>Restore</span>
                </button>

                {/* Permanent Delete Button */}
                {canHardDelete ? (
                  <button
                    onClick={() => onHardDelete(item.id, item.title)}
                    style={styles.permanentDeleteBtn}
                    title="Permanently remove from database (Owner / HR only)"
                  >
                    <AlertOctagon size={14} />
                    <span>Delete Permanently</span>
                  </button>
                ) : (
                  <div style={styles.restrictedBadge} title="Permanent delete requires Owner or HR login">
                    <ShieldAlert size={13} color="#94a3b8" />
                    <span>Owner / HR Only</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '8px 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#191d31',
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    borderRadius: '99px',
    fontSize: '13px',
    fontWeight: '700',
  },
  empty: {
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1px solid #edf0f7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '18px',
    border: '1px solid #edf0f7',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  },
  cardTop: {
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
    backgroundColor: '#f1f5f9',
    color: '#475569',
  },
  statusPill: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#94a3b8',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#191d31',
    marginBottom: '6px',
  },
  cardDesc: {
    fontSize: '13px',
    color: '#787f95',
    lineHeight: '1.4',
    marginBottom: '12px',
  },
  metaRow: {
    marginBottom: '12px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#f1f3f7',
    marginBottom: '14px',
  },
  actionsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
  },
  restoreBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '10px',
    backgroundColor: '#ebf0ff',
    color: '#3157d5',
    fontSize: '12px',
    fontWeight: '700',
    transition: 'background 0.15s',
  },
  permanentDeleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '10px',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    fontSize: '12px',
    fontWeight: '700',
    transition: 'background 0.15s',
  },
  restrictedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '10px',
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
    fontSize: '11px',
    fontWeight: '600',
  },
};

