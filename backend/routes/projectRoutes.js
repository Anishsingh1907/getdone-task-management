const express = require('express');
const router = express.Router();
const {
  getActiveProjects,
  getProjectById,
  createNewProject,
  updateExistingProject,
  tempDeleteProject,
  getTrashProjects,
  restoreDeletedProject,
  permanentlyDeleteProject,
} = require('../controllers/projectController');
const { authenticate, requirePermanentDelete } = require('../middleware/auth');

// All project routes require authentication
router.use(authenticate);

// List active projects (role-aware)
router.get('/', getActiveProjects);

// List soft-deleted projects in trash
router.get('/trash', getTrashProjects);

// Get single project
router.get('/:id', getProjectById);

// Create new project / task
router.post('/', createNewProject);

// Update project / task
router.put('/:id', updateExistingProject);

// Soft delete (TempDelete) - Available to all roles
router.patch('/:id/temp-delete', tempDeleteProject);

// Restore project from trash
router.patch('/:id/restore', restoreDeletedProject);

// Permanent Hard Delete - Strictly restricted to Owner & HR
router.delete('/:id', requirePermanentDelete, permanentlyDeleteProject);

module.exports = router;

