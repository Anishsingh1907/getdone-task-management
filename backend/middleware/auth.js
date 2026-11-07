const jwt = require('jsonwebtoken');
const { findUserById, findUserByEmail, getUsers } = require('../services/dataService');

const JWT_SECRET = process.env.JWT_SECRET || 'getdone_jwt_super_secret_internship_key_2026';

// Role Visibility Rules as specified in client specs:
// Owner => All project (Complete, Ongoing, yet To Final, pending)
// Admin => All project (Complete, Ongoing, pending)
// HR => All project (Complete, Ongoing, pending)
// Employee => Assign project (Complete, Ongoing)
const ROLE_ALLOWED_STATUSES = {
  Owner: ['pending', 'ongoing', 'yetToFinal', 'complete'],
  Admin: ['pending', 'ongoing', 'complete'],
  HR: ['pending', 'ongoing', 'complete'],
  Employee: ['ongoing', 'complete'],
};

// Permanent delete access => Owner Login, HR
const canHardDeleteRole = (role) => {
  return role === 'Owner' || role === 'HR';
};

/**
 * Authentication Middleware
 * Supports JWT Bearer tokens as well as Developer / Swagger Headers:
 * - x-user-id: 'user_1'
 * - x-user-role: 'Owner' | 'Admin' | 'HR' | 'Employee'
 * - x-user-email: 'owner@demo.com'
 */
const authenticate = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await findUserById(decoded.id);
        if (user) {
          req.user = user;
          return next();
        }
      } catch (err) {
        // Fall through to header checks
      }
    }

    // Direct header-based auth for testing, Swagger UI & demo role switching
    const headerUserId = req.headers['x-user-id'];
    const headerRole = req.headers['x-user-role'];
    const headerEmail = req.headers['x-user-email'];

    if (headerUserId) {
      const user = await findUserById(headerUserId);
      if (user) {
        req.user = user;
        return next();
      }
    }

    if (headerEmail) {
      const user = await findUserByEmail(headerEmail);
      if (user) {
        req.user = user;
        return next();
      }
    }

    if (headerRole) {
      const allUsers = await getUsers();
      const match = allUsers.find((u) => u.role.toLowerCase() === headerRole.toLowerCase());
      if (match) {
        req.user = match;
        return next();
      }
    }

    // Default to Owner for unauthenticated public preview or return 401
    // For convenience in Swagger without login, fallback to Owner or first user
    const users = await getUsers();
    req.user = users[0] || {
      id: 'user_1',
      name: 'Anish Owner',
      email: 'owner@demo.com',
      role: 'Owner',
      title: 'Founder & CEO',
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication failed', error: error.message });
  }
};

/**
 * RBAC: Restrict endpoint to specific roles
 */
const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized to perform this action. Required: ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
};

/**
 * Enforce Permanent Delete Permission:
 * Only Owner and HR can permanently delete data.
 */
const requirePermanentDelete = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
  }
  if (!canHardDeleteRole(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access Denied: Only 'Owner' and 'HR' roles have permanent data delete access. Current role: '${req.user.role}'.`,
    });
  }
  next();
};

module.exports = {
  authenticate,
  requireRoles,
  requirePermanentDelete,
  canHardDeleteRole,
  ROLE_ALLOWED_STATUSES,
  JWT_SECRET,
};

