const User = require('../models/User');
const Project = require('../models/Project');
const { getIsConnected } = require('../config/db');
const { SEED_USERS, SEED_PROJECTS } = require('../config/seedData');

// In-memory fallback repository
let inMemoryUsers = JSON.parse(JSON.stringify(SEED_USERS));
let inMemoryProjects = JSON.parse(JSON.stringify(SEED_PROJECTS));

// Auto seed MongoDB if connected and empty
const initMongoSeed = async () => {
  if (!getIsConnected()) return;
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Seed] Seeding initial users into MongoDB...');
      for (const u of SEED_USERS) {
        await User.create({
          _id: u.id,
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role,
          title: u.title,
          avatar: u.avatar
        }).catch(() => {});
      }
    }
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log('[Seed] Seeding initial projects into MongoDB...');
      for (const p of SEED_PROJECTS) {
        await Project.create({
          _id: p.id,
          title: p.title,
          desc: p.desc,
          status: p.status,
          tag: p.tag,
          taskType: p.taskType,
          assignees: p.assignees,
          createdBy: p.createdBy,
          dueDate: p.dueDate,
          estimatedHours: p.estimatedHours,
          commentsCount: p.commentsCount,
          attachmentsCount: p.attachmentsCount,
          location: p.location,
          deleted: p.deleted,
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.warn('[Seed Warning] MongoDB initial seed skipped:', err.message);
  }
};

// Users data access
const getUsers = async () => {
  if (getIsConnected()) {
    try {
      const users = await User.find().lean();
      if (users && users.length > 0) {
        return users.map(u => ({ ...u, id: u._id?.toString() || u.id }));
      }
    } catch (e) {
      // Fallback
    }
  }
  return inMemoryUsers;
};

const findUserByEmail = async (email) => {
  const normalized = (email || '').trim().toLowerCase();
  if (getIsConnected()) {
    try {
      const user = await User.findOne({ email: normalized }).lean();
      if (user) return { ...user, id: user._id?.toString() || user.id };
    } catch (e) {}
  }
  return inMemoryUsers.find(u => u.email.toLowerCase() === normalized) || null;
};

const findUserById = async (id) => {
  if (getIsConnected()) {
    try {
      const user = await User.findById(id).lean();
      if (user) return { ...user, id: user._id?.toString() || user.id };
    } catch (e) {}
  }
  return inMemoryUsers.find(u => u.id === id) || null;
};

// Projects data access
const getProjects = async () => {
  if (getIsConnected()) {
    try {
      const projects = await Project.find().lean();
      if (projects && projects.length > 0) {
        return projects.map(p => ({ ...p, id: p._id?.toString() || p.id }));
      }
    } catch (e) {}
  }
  return inMemoryProjects;
};

const findProjectById = async (id) => {
  if (getIsConnected()) {
    try {
      const project = await Project.findById(id).lean();
      if (project) return { ...project, id: project._id?.toString() || project.id };
    } catch (e) {}
  }
  return inMemoryProjects.find(p => p.id === id) || null;
};

const createProject = async (data) => {
  const newId = 'proj_' + Date.now();
  const projectObj = {
    ...data,
    id: newId,
    deleted: false,
    deletedAt: null,
    deletedBy: null,
    commentsCount: data.commentsCount || 0,
    attachmentsCount: data.attachmentsCount || 0,
    estimatedHours: data.estimatedHours || 4.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (getIsConnected()) {
    try {
      const created = await Project.create({
        _id: newId,
        ...projectObj
      });
      return { ...created.toObject(), id: created._id.toString() };
    } catch (e) {
      console.warn('[MongoDB Insert Fallback]', e.message);
    }
  }

  inMemoryProjects.unshift(projectObj);
  return projectObj;
};

const updateProject = async (id, data) => {
  if (getIsConnected()) {
    try {
      const updated = await Project.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updated) return { ...updated, id: updated._id.toString() };
    } catch (e) {}
  }

  const index = inMemoryProjects.findIndex(p => p.id === id);
  if (index !== -1) {
    inMemoryProjects[index] = {
      ...inMemoryProjects[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return inMemoryProjects[index];
  }
  return null;
};

// Soft delete (TempDelete)
const softDeleteProject = async (id, userId) => {
  return updateProject(id, {
    deleted: true,
    deletedAt: new Date().toISOString(),
    deletedBy: userId
  });
};

// Restore from soft delete
const restoreProject = async (id) => {
  return updateProject(id, {
    deleted: false,
    deletedAt: null,
    deletedBy: null
  });
};

// Hard delete (Permanent delete - Owner / HR only)
const hardDeleteProject = async (id) => {
  if (getIsConnected()) {
    try {
      await Project.findByIdAndDelete(id);
    } catch (e) {}
  }
  const beforeCount = inMemoryProjects.length;
  inMemoryProjects = inMemoryProjects.filter(p => p.id !== id);
  return beforeCount !== inMemoryProjects.length;
};

module.exports = {
  initMongoSeed,
  getUsers,
  findUserByEmail,
  findUserById,
  getProjects,
  findProjectById,
  createProject,
  updateProject,
  softDeleteProject,
  restoreProject,
  hardDeleteProject
};

