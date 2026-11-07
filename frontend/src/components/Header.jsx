import React from 'react';
import { Search, Bell, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Header({
  pageTitle = 'Daily Task',
  searchQuery,
  setSearchQuery,
  currentUser,
  allUsers = [],
  onSwitchUser,
}) {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const roleColors = {
    Owner: { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' },
    Admin: { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
    HR: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
    Employee: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  };

  const badgeStyle = roleColors[currentUser?.role] || roleColors.Employee;

  return (
    <header style={styles.header}>
      {/* Title & Swagger Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={styles.title}>{pageTitle}</h1>
        <a
          href="http://localhost:5000/api-docs"
          target="_blank"
          rel="noreferrer"
          style={styles.swaggerLink}
          title="Open Swagger OpenAPI Documentation"
        >
          <ExternalLink size={13} />
          <span>Swagger API Docs</span>
        </a>
      </div>

      {/* Right Controls */}
      <div style={styles.rightControls}>
        {/* Search Bar */}
        <div style={styles.searchBox}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Quick Role Switcher for Evaluator */}
        <div style={styles.roleSwitcher}>
          <ShieldCheck size={15} color="#3157d5" />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Role:</span>
          <select
            value={currentUser?.id}
            onChange={(e) => {
              const selected = allUsers.find((u) => u.id === e.target.value);
              if (selected) onSwitchUser(selected);
            }}
            style={styles.roleSelect}
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

        {/* Notification Bell */}
        <button style={styles.bellBtn} title="Notifications">
          <Bell size={18} color="#475569" />
          <span style={styles.notificationDot} />
        </button>

        {/* Profile Avatar & Info */}
        <div style={styles.profileBox}>
          {currentUser?.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.name} style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarFallback}>{getInitials(currentUser?.name)}</div>
          )}
          <div style={styles.profileText}>
            <span style={styles.profileName}>{currentUser?.name}</span>
            <span
              style={{
                ...styles.roleBadge,
                backgroundColor: badgeStyle.bg,
                color: badgeStyle.text,
                borderColor: badgeStyle.border,
              }}
            >
              {currentUser?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 28px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #edf0f7',
    position: 'sticky',
    top: 0,
    zIndex: 40,
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#191d31',
    letterSpacing: '-0.4px',
  },
  swaggerLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#ebf0ff',
    color: '#3157d5',
    borderRadius: '99px',
    fontSize: '12px',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'background 0.15s',
  },
  rightControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f4f5fa',
    borderRadius: '12px',
    padding: '8px 14px',
    width: '220px',
  },
  searchInput: {
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
    color: '#1e293b',
    width: '100%',
  },
  roleSwitcher: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '6px 10px',
  },
  roleSelect: {
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '12px',
    fontWeight: '600',
    color: '#1e293b',
    cursor: 'pointer',
  },
  bellBtn: {
    position: 'relative',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #edf0f7',
  },
  notificationDot: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '7px',
    height: '7px',
    backgroundColor: '#ef4444',
    borderRadius: '50%',
    border: '1.5px solid #ffffff',
  },
  profileBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatarImg: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #e2e8f0',
  },
  avatarFallback: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#3157d5',
    color: '#ffffff',
    display: 'grid',
    placeItems: 'center',
    fontWeight: '700',
    fontSize: '13px',
  },
  profileText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  profileName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#191d31',
  },
  roleBadge: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '1px 6px',
    borderRadius: '99px',
    border: '1px solid',
    display: 'inline-block',
    textAlign: 'center',
  },
};

