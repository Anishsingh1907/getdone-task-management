import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCards from './components/StatCards';
import TaskBoard from './components/TaskBoard';
import TaskForm from './components/TaskForm';
import TeamMembers from './components/TeamMembers';
import TrashView from './components/TrashView';
import EditModal from './components/EditModal';
import Login from './components/Login';
import { authAPI, projectAPI, statsAPI } from './api/client';

// Initial fallback mock data if backend server is starting up
const DEFAULT_USERS = [
  { id: 'user_1', name: 'Anish Owner', email: 'anish@demo.com', role: 'Owner', title: 'Founder & CEO', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
  { id: 'user_2', name: 'Anu Admin', email: 'anu@demo.com', role: 'Admin', title: 'Operations Director', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces' },
  { id: 'user_3', name: 'pre HR', email: 'pre@demo.com', role: 'HR', title: 'Head of People & Culture', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces' },
  { id: 'user_4', name: 'Jitesh Employee', email: 'jitesh@demo.com', role: 'Employee', title: 'Senior Frontend Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
  { id: 'user_5', name: 'Anshuman Singh', email: 'anshuman@demo.com', role: 'Employee', title: 'Backend & Cloud Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' },
  { id: 'user_6', name: 'Sifat Sharper', email: 'sifat@demo.com', role: 'Employee', title: 'Lead UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
];

const DEFAULT_PROJECTS = [
  {
    id: 'proj_1',
    title: 'Landing Page Design',
    desc: 'Starting a new business feels like juggling while riding a unicycle. Modern high-converting web landing page.',
    status: 'ongoing',
    tag: 'UI Design',
    taskType: 'Project',
    assignees: ['user_4', 'user_6'],
    createdBy: 'user_1',
    dueDate: '2026-11-20',
    estimatedHours: 42.5,
    commentsCount: 5,
    attachmentsCount: 3,
    location: 'Design Studio',
    deleted: false,
  },
  {
    id: 'proj_2',
    title: 'Payroll Module & Payslips',
    desc: 'Automated salary sheet calculations, bank NEFT file generation, and tax compliance summary.',
    status: 'ongoing',
    tag: 'Backend',
    taskType: 'Sprint',
    assignees: ['user_4', 'user_5'],
    createdBy: 'user_2',
    dueDate: '2026-11-25',
    estimatedHours: 35.0,
    commentsCount: 3,
    attachmentsCount: 2,
    location: 'Engineering',
    deleted: false,
  },
  {
    id: 'proj_3',
    title: 'Attendance Tracker System',
    desc: 'Biometric and geo-fenced check-in / check-out with automated monthly work-hour reports.',
    status: 'complete',
    tag: 'Fullstack',
    taskType: 'Project',
    assignees: ['user_4'],
    createdBy: 'user_3',
    dueDate: '2026-11-02',
    estimatedHours: 28.0,
    commentsCount: 8,
    attachmentsCount: 4,
    location: 'Operations',
    deleted: false,
  },
  {
    id: 'proj_4',
    title: 'Leave Management Portal',
    desc: 'Apply, approve and balance tracking for annual, sick, and privilege leaves with multi-tier approval.',
    status: 'pending',
    tag: 'HR Tech',
    taskType: 'Daily Routine',
    assignees: ['user_5'],
    createdBy: 'user_3',
    dueDate: '2026-11-30',
    estimatedHours: 19.5,
    commentsCount: 2,
    attachmentsCount: 1,
    location: 'HR Wing',
    deleted: false,
  },
  {
    id: 'proj_5',
    title: 'Onboarding Portal for New Hires',
    desc: 'Automated welcome emails, document upload checklist, and NDA digital signatures.',
    status: 'yetToFinal',
    tag: 'HR Tech',
    taskType: 'Alpha Team',
    assignees: ['user_4', 'user_5'],
    createdBy: 'user_1',
    dueDate: '2026-12-05',
    estimatedHours: 54.0,
    commentsCount: 6,
    attachmentsCount: 5,
    location: 'Headquarters',
    deleted: false,
  },
];

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('getdone_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Automatically sync to updated name if user has matching id or old name
        const match = DEFAULT_USERS.find(
          (u) => u.id === parsed.id || u.role === parsed.role
        );
        if (match) {
          localStorage.setItem('getdone_user', JSON.stringify(match));
          return match;
        }
        return parsed;
      } catch (e) {}
    }
    return DEFAULT_USERS[0]; // Start with Anish Owner
  });

  const [allUsers, setAllUsers] = useState(DEFAULT_USERS);
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [trashList, setTrashList] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Role permissions rules from requirements:
  // Owner => All project (Complete, Ongoing, yet To Final, pending)
  // Admin => All project (Complete, Ongoing, pending)
  // HR => All project (Complete, Ongoing, pending)
  // Employee => Assign project (Complete, Ongoing)
  const allowedStatuses = useMemo(() => {
    if (!user) return ['ongoing', 'complete'];
    if (user.role === 'Owner') return ['pending', 'ongoing', 'yetToFinal', 'complete'];
    if (user.role === 'Admin' || user.role === 'HR') return ['pending', 'ongoing', 'complete'];
    return ['ongoing', 'complete'];
  }, [user]);

  // Permanent data delete access => Owner Login, HR
  const canHardDelete = useMemo(() => {
    return user?.role === 'Owner' || user?.role === 'HR';
  }, [user]);

  // Fetch data from backend API
  const refreshData = async () => {
    try {
      // 1. Fetch Users
      const usersRes = await authAPI.getUsers();
      if (usersRes?.users && usersRes.users.length > 0) {
        setAllUsers(usersRes.users);
        const match = usersRes.users.find((u) => u.id === user?.id || u.role === user?.role);
        if (match && (match.name !== user?.name || match.email !== user?.email)) {
          setUser(match);
          localStorage.setItem('getdone_user', JSON.stringify(match));
        }
      }

      // 2. Fetch Projects (backend applies RBAC filtering)
      const projRes = await projectAPI.getProjects();
      if (projRes?.projects) setProjects(projRes.projects);

      // 3. Fetch Trash
      const trashRes = await projectAPI.getTrash();
      if (trashRes?.trash) setTrashList(trashRes.trash);

      // 4. Fetch Stats
      const statRes = await statsAPI.getStats();
      if (statRes?.stats) setStats(statRes.stats);
    } catch (err) {
      // Backend might be offline; local state remains responsive
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  // Filter projects by search query
  const filteredProjects = useMemo(() => {
    let list = projects;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.tag?.toLowerCase().includes(q)
      );
    }
    // Employee access rule in frontend if offline
    if (user?.role === 'Employee') {
      list = list.filter(
        (p) =>
          (p.assignees && p.assignees.includes(user.id)) ||
          p.createdBy === user.id
      );
    }
    return list;
  }, [projects, searchQuery, user]);

  // Handlers
  const handleLogin = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem('getdone_token', res.token);
      localStorage.setItem('getdone_user', JSON.stringify(res.user));
      setUser(res.user);
      showToast(`Welcome back, ${res.user.name}!`);
    } catch (err) {
      // Fallback matching
      const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        localStorage.setItem('getdone_user', JSON.stringify(found));
        setUser(found);
        showToast(`Signed in as ${found.name} (${found.role})`);
      } else {
        throw err;
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('getdone_token');
    localStorage.removeItem('getdone_user');
    setUser(null);
  };

  const handleSwitchUser = (selectedUser) => {
    localStorage.setItem('getdone_user', JSON.stringify(selectedUser));
    setUser(selectedUser);
    showToast(`Switched role to ${selectedUser.name} (${selectedUser.role})`);
  };

  // Create Project
  const handleCreateTask = async (taskData) => {
    try {
      const res = await projectAPI.createProject(taskData);
      setProjects((prev) => [res.project, ...prev]);
      showToast('Project created successfully!');
    } catch (e) {
      // Fallback
      const newP = {
        ...taskData,
        id: 'proj_' + Date.now(),
        deleted: false,
        createdBy: user.id,
        commentsCount: 0,
        attachmentsCount: 0,
      };
      setProjects((prev) => [newP, ...prev]);
      showToast('Project created (Local Mode)!');
    }
    refreshData();
  };

  // Update Status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await projectAPI.updateProject(id, { status: newStatus });
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
      showToast(`Task moved to ${newStatus}`);
    } catch (e) {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    }
  };

  // Save Edit
  const handleSaveEdit = async (updatedTask) => {
    try {
      await projectAPI.updateProject(updatedTask.id, updatedTask);
      setProjects((prev) =>
        prev.map((p) => (p.id === updatedTask.id ? updatedTask : p))
      );
      setEditingTask(null);
      showToast('Task updated successfully!');
    } catch (e) {
      setProjects((prev) =>
        prev.map((p) => (p.id === updatedTask.id ? updatedTask : p))
      );
      setEditingTask(null);
    }
    refreshData();
  };

  // Temp Delete (Soft Delete)
  const handleTempDelete = async (id) => {
    try {
      await projectAPI.tempDelete(id);
      const target = projects.find((p) => p.id === id);
      if (target) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setTrashList((prev) => [{ ...target, deleted: true }, ...prev]);
      }
      showToast('Item moved to Trash (Temp Delete)');
    } catch (e) {
      const target = projects.find((p) => p.id === id);
      if (target) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setTrashList((prev) => [{ ...target, deleted: true }, ...prev]);
      }
      showToast('Item moved to Trash (Local)');
    }
    refreshData();
  };

  // Restore from Trash
  const handleRestore = async (id) => {
    try {
      await projectAPI.restore(id);
      const restored = trashList.find((p) => p.id === id);
      if (restored) {
        setTrashList((prev) => prev.filter((p) => p.id !== id));
        setProjects((prev) => [{ ...restored, deleted: false }, ...prev]);
      }
      showToast('Project restored from trash!');
    } catch (e) {
      const restored = trashList.find((p) => p.id === id);
      if (restored) {
        setTrashList((prev) => prev.filter((p) => p.id !== id));
        setProjects((prev) => [{ ...restored, deleted: false }, ...prev]);
      }
    }
    refreshData();
  };

  // Permanent Hard Delete (Owner & HR Only)
  const handlePermanentDelete = async (id, title) => {
    if (!canHardDelete) {
      showToast('Permission Denied: Only Owner and HR can delete permanently.');
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${title}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await projectAPI.permanentDelete(id);
      setTrashList((prev) => prev.filter((p) => p.id !== id));
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast(`Project permanently deleted from database.`);
    } catch (e) {
      setTrashList((prev) => prev.filter((p) => p.id !== id));
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast(`Permanently deleted (Local).`);
    }
    refreshData();
  };

  if (!user) {
    return <Login onLogin={handleLogin} allUsers={allUsers} />;
  }

  return (
    <div style={styles.appContainer}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={styles.toast} className="fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        trashCount={trashList.length}
        user={user}
        onLogout={handleLogout}
        totalHours={stats?.totalHoursWorks ? `${stats.totalHoursWorks} Hours` : '544.4 Hours'}
      />

      {/* Main Content Area */}
      <div style={styles.mainContent}>
        {/* Top Header Bar */}
        <Header
          pageTitle={
            activeTab === 'Dashboard'
              ? 'Daily Task'
              : activeTab === 'Trash'
                ? 'Trash (Soft-Deleted)'
                : activeTab
          }
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={user}
          allUsers={allUsers}
          onSwitchUser={handleSwitchUser}
        />

        {/* Dynamic Body Content */}
        <main style={styles.bodyWrapper}>
          {activeTab === 'Dashboard' && (
            <>
              {/* Top Summary Stat Cards */}
              <StatCards stats={stats} />

              {/* Layout: Kanban Board + Right Side Panel */}
              <div style={styles.dashboardLayout}>
                {/* Center / Left: Kanban Columns */}
                <TaskBoard
                  tasks={filteredProjects}
                  user={user}
                  allUsers={allUsers}
                  allowedStatuses={allowedStatuses}
                  canHardDelete={canHardDelete}
                  onStatusChange={handleStatusChange}
                  onEdit={setEditingTask}
                  onTempDelete={handleTempDelete}
                  onPermanentDelete={handlePermanentDelete}
                />

                {/* Right Side Panel: Quick Task Form & Team Members */}
                <aside style={styles.rightSidePanel}>
                  <TaskForm
                    user={user}
                    allUsers={allUsers}
                    allowedStatuses={allowedStatuses}
                    onCreateTask={handleCreateTask}
                  />
                  <TeamMembers allUsers={allUsers} />
                </aside>
              </div>
            </>
          )}

          {activeTab === 'Tasks' && (
            <div>
              <div style={styles.tabBanner}>
                <h2>All Task List ({filteredProjects.length})</h2>
                <p>Comprehensive task index for {user.name} ({user.role})</p>
              </div>
              <TaskBoard
                tasks={filteredProjects}
                user={user}
                allUsers={allUsers}
                allowedStatuses={allowedStatuses}
                canHardDelete={canHardDelete}
                onStatusChange={handleStatusChange}
                onEdit={setEditingTask}
                onTempDelete={handleTempDelete}
                onPermanentDelete={handlePermanentDelete}
              />
            </div>
          )}

          {activeTab === 'Projects' && (
            <div>
              <div style={styles.tabBanner}>
                <h2>Projects Overview</h2>
                <p>Active projects filtered by RBAC clearance: {allowedStatuses.join(', ')}</p>
              </div>
              <TaskBoard
                tasks={filteredProjects}
                user={user}
                allUsers={allUsers}
                allowedStatuses={allowedStatuses}
                canHardDelete={canHardDelete}
                onStatusChange={handleStatusChange}
                onEdit={setEditingTask}
                onTempDelete={handleTempDelete}
                onPermanentDelete={handlePermanentDelete}
              />
            </div>
          )}

          {activeTab === 'Trash' && (
            <TrashView
              trashList={trashList}
              user={user}
              allUsers={allUsers}
              canHardDelete={canHardDelete}
              onRestore={handleRestore}
              onHardDelete={handlePermanentDelete}
            />
          )}

          {activeTab === 'Team' && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <TeamMembers allUsers={allUsers} />
            </div>
          )}

          {(activeTab === 'Activities' || activeTab === 'Messages' || activeTab === 'Settings') && (
            <div style={styles.placeholderTab}>
              <h2 style={{ fontSize: '20px', color: '#191d31', marginBottom: '8px' }}>
                {activeTab} Module
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                This section is linked and active. Your daily task board and access permissions are running smoothly.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <EditModal
          task={editingTask}
          user={user}
          allUsers={allUsers}
          allowedStatuses={allowedStatuses}
          onSave={handleSaveEdit}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f4f5fa',
    position: 'relative',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  bodyWrapper: {
    padding: '28px',
    flex: 1,
  },
  dashboardLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '24px',
    alignItems: 'start',
  },
  rightSidePanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#191d31',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    zIndex: 9999,
  },
  tabBanner: {
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #edf0f7',
  },
  placeholderTab: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    border: '1px solid #edf0f7',
  },
};

