import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  FolderKanban,
  MessageSquare,
  Users,
  Trash2,
  Settings,
  Sparkles,
  LogOut,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  trashCount = 0,
  user,
  onLogout,
  totalHours = '544.4 Hours',
}) {
  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Tasks', label: 'All Task List', icon: CheckSquare },
    { id: 'Activities', label: 'Activities', icon: Activity },
    { id: 'Projects', label: 'Projects', icon: FolderKanban },
    { id: 'Messages', label: 'Messages', icon: MessageSquare },
    { id: 'Team', label: 'Team', icon: Users },
    { id: 'Trash', label: 'Trash', icon: Trash2, count: trashCount },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Brand Logo */}
      <div style={styles.brand}>
        <div style={styles.logoIcon}>
          <Sparkles size={20} color="#ffffff" />
        </div>
        <span style={styles.brandName}>GetDone</span>
      </div>

      {/* Navigation List */}
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.navItem,
                backgroundColor: isActive ? '#3157d5' : 'transparent',
                color: isActive ? '#ffffff' : '#787f95',
                fontWeight: isActive ? '600' : '500',
              }}
            >
              <Icon size={18} color={isActive ? '#ffffff' : '#787f95'} />
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#fee2e2',
                    color: isActive ? '#ffffff' : '#ef4444',
                  }}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Info Card: Total Hours Works */}
      <div style={styles.hoursCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.85, fontSize: '12px' }}>
          <Clock size={14} />
          <span>Total Hours Works</span>
        </div>
        <div style={{ fontSize: '20px', fontWeight: '800', marginTop: '6px', letterSpacing: '-0.5px' }}>
          {totalHours}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', marginTop: '4px', opacity: 0.9 }}>
          <ArrowUpRight size={13} />
          <span>+3.5% from last month</span>
        </div>
      </div>

      {/* Logout button */}
      <button onClick={onLogout} style={styles.logoutBtn}>
        <LogOut size={16} />
        <span>Log Out</span>
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #edf0f7',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    height: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 8px 24px 8px',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: '#3157d5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(49, 87, 213, 0.3)',
  },
  brandName: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#191d31',
    letterSpacing: '-0.5px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 14px',
    borderRadius: '12px',
    fontSize: '14px',
    transition: 'all 0.15s ease',
    width: '100%',
  },
  badge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '99px',
  },
  hoursCard: {
    backgroundColor: '#3157d5',
    color: '#ffffff',
    borderRadius: '18px',
    padding: '18px 16px',
    boxShadow: '0 8px 20px rgba(49, 87, 213, 0.28)',
    marginBottom: '14px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '10px',
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'color 0.15s',
  },
};

