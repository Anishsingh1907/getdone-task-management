const {
  getProjects,
  findProjectById,
  createProject,
  updateProject,
  softDeleteProject,
  restoreProject,
  hardDeleteProject,
} = require('../services/dataService');
const { ROLE_ALLOWED_STATUSES, canHardDeleteRole } = require('../middleware/auth');

/**
 * Helper to check whether an employee has access to a project
 * Jo project jisko Assign hoga usi project access uske pass hoga.
 * Jo Project usne complete kiya hoga ya uspe work kr raha hoga wohi project uske dashboard pe dikhega.
 */
const employeeHasAccess = (project, userId) => {
  if (!project) return false;
  const isAssigned = Array.isArray(project.assignees) && project.assignees.some((a) => String(a) === String(userId));
  const isCreator = String(project.createdBy) === String(userId);
  return isAssigned || isCreator;
};

/**
 * GET /api/projects
 * List active (non-deleted) projects with role-based filtering
 */
const getActiveProjects = async (req, res) => {
  try {
    const user = req.user;
    const { status, search, tag, taskType } = req.query;

    const all = await getProjects();

    // 1. Filter out soft deleted
    let filtered = all.filter((p) => !p.deleted);

    // 2. Role visibility filter
    const allowedStatuses = ROLE_ALLOWED_STATUSES[user.role] || ['ongoing', 'complete'];
    filtered = filtered.filter((p) => allowedStatuses.includes(p.status));

    // 3. Employee specific access rule:
    // Only assigned projects or projects created/worked on by the employee
    if (user.role === 'Employee') {
      filtered = filtered.filter((p) => employeeHasAccess(p, user.id));
    }

    // 4. Query filters (status, search, tag, taskType)
    if (status && status !== 'all') {
      filtered = filtered.filter((p) => p.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.desc && p.desc.toLowerCase().includes(q)) ||
          (p.tag && p.tag.toLowerCase().includes(q))
      );
    }

    if (tag) {
      filtered = filtered.filter((p) => p.tag.toLowerCase() === tag.toLowerCase());
    }

    if (taskType) {
      filtered = filtered.filter((p) => p.taskType.toLowerCase() === taskType.toLowerCase());
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      role: user.role,
      allowedStatuses,
      projects: filtered,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve projects', error: error.message });
  }
};

/**
 * GET /api/projects/:id
 * Retrieve single project by ID with permission check
 */
const getProjectById = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const project = await findProjectById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Status permission check
    const allowedStatuses = ROLE_ALLOWED_STATUSES[user.role];
    if (!allowedStatuses.includes(project.status)) {
      return res.status(403).json({
        success: false,
        message: `Role '${user.role}' is not permitted to view projects with status '${project.status}'.`,
      });
    }

    // Employee assignment check
    if (user.role === 'Employee' && !employeeHasAccess(project, user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You can only view projects assigned to you.',
      });
    }

    return res.status(200).json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve project', error: error.message });
  }
};

/**
 * POST /api/projects
 * Create a new task/project (Employee, HR, Admin, Owner)
 */
const createNewProject = async (req, res) => {
  try {
    const user = req.user;
    const {
      title,
      desc,
      status,
      tag,
      taskType,
      assignees,
      dueDate,
      estimatedHours,
      location,
      commentsCount,
      attachmentsCount,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Project title is required' });
    }

    // Role allowed status verification
    const allowedStatuses = ROLE_ALLOWED_STATUSES[user.role];
    const initialStatus = status && allowedStatuses.includes(status) ? status : allowedStatuses[0];

    // Assignee setup
    let finalAssignees = Array.isArray(assignees) ? assignees : [];
    if (user.role === 'Employee' && finalAssignees.length === 0) {
      // Auto assign to self if employee creates task
      finalAssignees = [user.id];
    }

    const projectData = {
      title: title.trim(),
      desc: desc || '',
      status: initialStatus,
      tag: tag || 'UI Design',
      taskType: taskType || 'Project',
      assignees: finalAssignees,
      createdBy: user.id,
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      estimatedHours: Number(estimatedHours) || 5.0,
      location: location || 'Main Office',
      commentsCount: Number(commentsCount) || 0,
      attachmentsCount: Number(attachmentsCount) || 0,
    };

    const created = await createProject(projectData);

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: created,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create project', error: error.message });
  }
};

/**
 * PUT /api/projects/:id
 * Update project details or status (All roles, employees only for assigned projects)
 */
const updateExistingProject = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const existing = await findProjectById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Employee check
    if (user.role === 'Employee' && !employeeHasAccess(existing, user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You can only edit projects assigned to you.',
      });
    }

    // Status validation
    if (req.body.status) {
      const allowed = ROLE_ALLOWED_STATUSES[user.role];
      if (!allowed.includes(req.body.status)) {
        return res.status(403).json({
          success: false,
          message: `Role '${user.role}' cannot set project status to '${req.body.status}'. Allowed: ${allowed.join(', ')}`,
        });
      }
    }

    const updated = await updateProject(id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update project', error: error.message });
  }
};

/**
 * PATCH /api/projects/:id/temp-delete
 * Soft delete (TempDelete) - Moves project to Trash
 * Allowed for all roles (Owner, Admin, HR, Employee)
 */
const tempDeleteProject = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const existing = await findProjectById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (user.role === 'Employee' && !employeeHasAccess(existing, user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You can only soft-delete projects assigned to you.',
      });
    }

    const updated = await softDeleteProject(id, user.id);

    return res.status(200).json({
      success: true,
      message: 'Project moved to trash (soft deleted) successfully',
      project: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to temp delete project', error: error.message });
  }
};

/**
 * GET /api/projects/trash
 * List soft-deleted projects
 */
const getTrashProjects = async (req, res) => {
  try {
    const user = req.user;
    const all = await getProjects();

    let trashed = all.filter((p) => p.deleted === true);

    const allowedStatuses = ROLE_ALLOWED_STATUSES[user.role];
    trashed = trashed.filter((p) => allowedStatuses.includes(p.status));

    if (user.role === 'Employee') {
      trashed = trashed.filter((p) => employeeHasAccess(p, user.id));
    }

    return res.status(200).json({
      success: true,
      count: trashed.length,
      trash: trashed,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch trash', error: error.message });
  }
};

/**
 * PATCH /api/projects/:id/restore
 * Restore a soft-deleted project from trash
 */
const restoreDeletedProject = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const existing = await findProjectById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (user.role === 'Employee' && !employeeHasAccess(existing, user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You can only restore projects assigned to you.',
      });
    }

    const restored = await restoreProject(id);

    return res.status(200).json({
      success: true,
      message: 'Project restored from trash successfully',
      project: restored,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to restore project', error: error.message });
  }
};

/**
 * DELETE /api/projects/:id
 * Permanent Hard Delete
 * STRICT REQUIREMENT: Only Owner & HR have access!
 */
const permanentlyDeleteProject = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!canHardDeleteRole(user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Permanent data delete access is restricted to Owner and HR only. Current role: '${user.role}'.`,
      });
    }

    const existing = await findProjectById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await hardDeleteProject(id);

    return res.status(200).json({
      success: true,
      message: `Project '${existing.title}' deleted permanently by ${user.role} (${user.name}).`,
      deletedId: id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to permanently delete project', error: error.message });
  }
};

module.exports = {
  getActiveProjects,
  getProjectById,
  createNewProject,
  updateExistingProject,
  tempDeleteProject,
  getTrashProjects,
  restoreDeletedProject,
  permanentlyDeleteProject,
};

