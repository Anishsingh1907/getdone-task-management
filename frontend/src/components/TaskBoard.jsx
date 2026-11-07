import React from 'react';
import TaskCard from './TaskCard';

export default function TaskBoard({
  tasks = [],
  user,
  allUsers = [],
  allowedStatuses = [],
  canHardDelete = false,
  onStatusChange,
  onEdit,
  onTempDelete,
  onPermanentDelete,
}) {
  const columnConfigs = {
    pending: {
      key: 'pending',
      title: 'Coming Next',
      pillBg: '#64748b',
      pillColor: '#ffffff',
    },
    ongoing: {
      key: 'ongoing',
      title: 'In Progress',
      pillBg: '#3157d5',
      pillColor: '#ffffff',
    },
    yetToFinal: {
      key: 'yetToFinal',
      title: 'Yet To Final',
      pillBg: '#f59e0b',
      pillColor: '#ffffff',
    },
    complete: {
      key: 'complete',
      title: 'Completed',
      pillBg: '#10b981',
      pillColor: '#ffffff',
    },
  };

  // Only render columns that the current role is permitted to see
  const visibleColumns = allowedStatuses.map((s) => columnConfigs[s]).filter(Boolean);

  return (
    <div style={styles.boardContainer}>
      <div style={styles.columnsGrid}>
        {visibleColumns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);

          return (
            <div key={col.key} style={styles.column}>
              {/* Column Header Pill */}
              <div
                style={{
                  ...styles.columnHeader,
                  backgroundColor: col.pillBg,
                  color: col.pillColor,
                }}
              >
                <span style={styles.colTitle}>{col.title}</span>
                <span style={styles.colCount}>{colTasks.length}</span>
              </div>

              {/* Tasks List */}
              <div style={styles.tasksList}>
                {colTasks.length === 0 ? (
                  <div style={styles.emptyState}>
                    <span>No tasks in {col.title}</span>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      user={user}
                      allUsers={allUsers}
                      allowedStatuses={allowedStatuses}
                      canHardDelete={canHardDelete}
                      onStatusChange={onStatusChange}
                      onEdit={onEdit}
                      onTempDelete={onTempDelete}
                      onPermanentDelete={onPermanentDelete}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  boardContainer: {
    flex: 1,
    minWidth: 0,
  },
  columnsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
    alignItems: 'start',
  },
  column: {
    backgroundColor: '#f8fafc',
    borderRadius: '20px',
    padding: '12px',
    minHeight: '400px',
    border: '1px solid #edf0f7',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    borderRadius: '99px',
    marginBottom: '14px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
  },
  colTitle: {
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '-0.2px',
  },
  colCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '99px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: '800',
  },
  tasksList: {
    minHeight: '150px',
  },
  emptyState: {
    padding: '30px 16px',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: '500',
    border: '1.5px dashed #e2e8f0',
    borderRadius: '14px',
    marginTop: '6px',
  },
};

